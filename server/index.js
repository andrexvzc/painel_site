import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { db, initDb, ORIGENS, parseContagem } from './db.js'
import { signToken, requireAuth, optionalAuth } from './auth.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

initDb()

/* ----------------------------- Autenticação ----------------------------- */

// Cadastro de usuário
app.post('/api/auth/register', (req, res) => {
  const nome = req.body.nome?.trim()
  const email = req.body.email?.trim().toLowerCase()
  const senha = req.body.senha

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Campos 'nome', 'email' e 'senha' são obrigatórios" })
  }
  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' })
  }

  const existe = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existe) {
    return res.status(409).json({ error: 'Já existe uma conta com este e-mail' })
  }

  const senha_hash = bcrypt.hashSync(senha, 10)
  const result = db
    .prepare('INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome, email, senha_hash)

  const user = { id: Number(result.lastInsertRowid), nome, email }
  res.status(201).json({ token: signToken(user), user })
})

// Login
app.post('/api/auth/login', (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const senha = req.body.senha

  const row = email ? db.prepare('SELECT * FROM users WHERE email = ?').get(email) : null
  if (!row || !bcrypt.compareSync(senha || '', row.senha_hash)) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos' })
  }

  const user = { id: row.id, nome: row.nome, email: row.email }
  res.json({ token: signToken(user), user })
})

// Dados do usuário autenticado
app.get('/api/auth/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT id, nome, email FROM users WHERE id = ?').get(req.user.id)
  if (!row) return res.status(404).json({ error: 'Usuário não encontrado' })
  res.json(row)
})

/* ------------------------------- Postagens ------------------------------ */

// Lista as postagens. Aceita ?origem=Youtube|Instagram|Twitter|Noticia e ?salvos=true.
// 'salvo' é calculado em relação ao usuário autenticado (se houver token).
app.get('/api/posts', optionalAuth, (req, res) => {
  const { origem, salvos, topico } = req.query

  if (origem && !ORIGENS.includes(origem)) {
    return res.status(400).json({ error: `Origem inválida. Use uma de: ${ORIGENS.join(', ')}` })
  }
  if (salvos === 'true' && !req.user) {
    return res.status(401).json({ error: 'Faça login para ver suas postagens salvas' })
  }

  const userId = req.user?.id ?? 0
  // Dois placeholders de userId: um para o JOIN de salvos, outro para o de curtidas
  const params = [userId, userId]
  const where = []

  if (origem) {
    where.push('p.origem = ?')
    params.push(origem)
  }
  if (topico) {
    where.push('p.topico = ?')
    params.push(topico)
  }
  if (salvos === 'true') {
    where.push('s.user_id IS NOT NULL')
  }

  const sql = `
    SELECT p.*,
      CASE WHEN s.user_id IS NOT NULL THEN 1 ELSE 0 END AS salvo,
      CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS curtido
    FROM posts p
    LEFT JOIN saved_posts s ON s.post_id = p.id AND s.user_id = ?
    LEFT JOIN liked_posts l ON l.post_id = p.id AND l.user_id = ?
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY p.id DESC
  `

  res.json(db.prepare(sql).all(...params))
})

// Lista os tópicos existentes com a contagem de postagens de cada um
app.get('/api/topicos', (req, res) => {
  const rows = db
    .prepare(
      `SELECT topico AS nome, COUNT(*) AS total
       FROM posts
       WHERE topico IS NOT NULL
       GROUP BY topico
       ORDER BY topico`
    )
    .all()
  res.json(rows)
})

// Busca uma postagem específica
app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(req.params.id))
  if (!post) return res.status(404).json({ error: 'Postagem não encontrada' })
  res.json(post)
})

// Salva ou remove dos salvos do usuário autenticado ({ salvo: true|false })
app.patch('/api/posts/:id/salvar', requireAuth, (req, res) => {
  const postId = Number(req.params.id)
  const salvo = !!req.body.salvo

  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId)
  if (!post) return res.status(404).json({ error: 'Postagem não encontrada' })

  if (salvo) {
    db.prepare(
      'INSERT OR IGNORE INTO saved_posts (user_id, post_id) VALUES (?, ?)'
    ).run(req.user.id, postId)
  } else {
    db.prepare('DELETE FROM saved_posts WHERE user_id = ? AND post_id = ?').run(req.user.id, postId)
  }

  res.json({ id: postId, salvo: salvo ? 1 : 0 })
})

// Curte ou descurte uma postagem ({ curtido: true|false }).
// Incrementa/decrementa o contador 'curtidas' sem permitir curtida dupla.
app.patch('/api/posts/:id/curtir', requireAuth, (req, res) => {
  const postId = Number(req.params.id)
  const curtido = !!req.body.curtido

  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId)
  if (!post) return res.status(404).json({ error: 'Postagem não encontrada' })

  const jaCurtiu = db
    .prepare('SELECT 1 FROM liked_posts WHERE user_id = ? AND post_id = ?')
    .get(req.user.id, postId)

  if (curtido && !jaCurtiu) {
    db.prepare('INSERT INTO liked_posts (user_id, post_id) VALUES (?, ?)').run(req.user.id, postId)
    db.prepare('UPDATE posts SET curtidas = curtidas + 1 WHERE id = ?').run(postId)
  } else if (!curtido && jaCurtiu) {
    db.prepare('DELETE FROM liked_posts WHERE user_id = ? AND post_id = ?').run(req.user.id, postId)
    db.prepare('UPDATE posts SET curtidas = MAX(0, curtidas - 1) WHERE id = ?').run(postId)
  }

  const { curtidas } = db.prepare('SELECT curtidas FROM posts WHERE id = ?').get(postId)
  res.json({ id: postId, curtido: curtido ? 1 : 0, curtidas })
})

// Cria uma nova postagem (requer login)
app.post('/api/posts', requireAuth, (req, res) => {
  const { origem, autor, handle, conteudo, imagem, link, replies, retweets, likes, views } = req.body

  if (!origem || !ORIGENS.includes(origem)) {
    return res.status(400).json({ error: `Campo 'origem' obrigatório. Use uma de: ${ORIGENS.join(', ')}` })
  }
  if (!autor || !conteudo) {
    return res.status(400).json({ error: "Campos 'autor' e 'conteudo' são obrigatórios" })
  }

  const result = db
    .prepare(
      `INSERT INTO posts (origem, autor, handle, conteudo, imagem, link, replies, retweets, likes, views, curtidas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      origem,
      autor,
      handle ?? null,
      conteudo,
      imagem ?? null,
      link ?? null,
      replies ?? '0',
      retweets ?? '0',
      likes ?? '0',
      views ?? '0',
      parseContagem(likes ?? '0')
    )

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(post)
})

app.listen(PORT, () => {
  console.log(`API do Painel+ rodando em http://localhost:${PORT}/api`)
})
