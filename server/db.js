import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Banco SQLite em arquivo (criado automaticamente na primeira execução)
export const db = new DatabaseSync(join(__dirname, 'painel.db'))

// Habilita verificação de chaves estrangeiras (ON DELETE CASCADE)
db.exec('PRAGMA foreign_keys = ON')

// Origens permitidas para as postagens
export const ORIGENS = ['Youtube', 'Instagram', 'Twitter', 'Noticia']

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      origem    TEXT NOT NULL CHECK (origem IN ('Youtube', 'Instagram', 'Twitter', 'Noticia')),
      autor     TEXT NOT NULL,
      handle    TEXT,
      conteudo  TEXT NOT NULL,
      imagem    TEXT,
      link      TEXT,
      replies   TEXT DEFAULT '0',
      retweets  TEXT DEFAULT '0',
      likes     TEXT DEFAULT '0',
      views     TEXT DEFAULT '0',
      curtidas  INTEGER NOT NULL DEFAULT 0,
      topico    TEXT,
      criado_em TEXT DEFAULT (datetime('now'))
    )
  `)

  // Usuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      criado_em  TEXT DEFAULT (datetime('now'))
    )
  `)

  // Relação: postagens salvas por cada usuário
  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_posts (
      user_id   INTEGER NOT NULL,
      post_id   INTEGER NOT NULL,
      criado_em TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `)

  // Relação: postagens curtidas por cada usuário (evita curtida dupla)
  db.exec(`
    CREATE TABLE IF NOT EXISTS liked_posts (
      user_id   INTEGER NOT NULL,
      post_id   INTEGER NOT NULL,
      criado_em TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `)

  migrate()

  // Popula o banco apenas se ainda estiver vazio
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM posts').get()
  if (total === 0) {
    seed()
  }
}

// Converte um valor textual abreviado (ex.: "12k", "1.2M", "850") em número inteiro.
export function parseContagem(texto) {
  if (texto == null) return 0
  const s = String(texto).trim().toLowerCase().replace(',', '.')
  const m = s.match(/^([\d.]+)\s*([km])?$/)
  if (!m) return parseInt(s, 10) || 0
  const n = parseFloat(m[1]) || 0
  const mult = m[2] === 'm' ? 1e6 : m[2] === 'k' ? 1e3 : 1
  return Math.round(n * mult)
}

// Migrações para bancos criados antes de novas colunas
function migrate() {
  const columns = db.prepare('PRAGMA table_info(posts)').all()
  const hasColumn = (name) => columns.some((c) => c.name === name)

  if (!hasColumn('link')) {
    db.exec('ALTER TABLE posts ADD COLUMN link TEXT')

    // Preenche o link das postagens já existentes
    const backfill = {
      'National Geographic': 'https://www.instagram.com/natgeo/',
      'Elon Musk': 'https://twitter.com/elonmusk',
      'Tech Reviewer': 'https://www.youtube.com/',
      Traveler: 'https://www.instagram.com/',
      'G1 Tecnologia': 'https://g1.globo.com/tecnologia/',
    }
    const update = db.prepare('UPDATE posts SET link = ? WHERE autor = ? AND link IS NULL')
    for (const [autor, link] of Object.entries(backfill)) {
      update.run(link, autor)
    }
    console.log('Migração aplicada: coluna "link" adicionada e preenchida.')
  }

  // Coluna numérica de curtidas, para permitir incremento real ao curtir.
  // O valor textual de exibição ('likes', ex.: "12k") é convertido em número.
  if (!hasColumn('curtidas')) {
    db.exec('ALTER TABLE posts ADD COLUMN curtidas INTEGER NOT NULL DEFAULT 0')
    const update = db.prepare('UPDATE posts SET curtidas = ? WHERE id = ?')
    for (const row of db.prepare('SELECT id, likes FROM posts').all()) {
      update.run(parseContagem(row.likes), row.id)
    }
    console.log('Migração aplicada: coluna "curtidas" adicionada e preenchida a partir de "likes".')
  }

  // Tópico da postagem (categoria editorial). Distribuído entre 20 tópicos no seed.
  if (!hasColumn('topico')) {
    db.exec('ALTER TABLE posts ADD COLUMN topico TEXT')
    console.log('Migração aplicada: coluna "topico" adicionada.')
  }

  // A coluna global 'salvo' foi substituída pela tabela saved_posts (por usuário)
  if (hasColumn('salvo')) {
    try {
      db.exec('ALTER TABLE posts DROP COLUMN salvo')
      console.log('Migração aplicada: coluna global "salvo" removida (agora é por usuário).')
    } catch {
      // SQLite antigo sem suporte a DROP COLUMN: ignora, a coluna fica órfã
    }
  }
}

function seed() {
  const insert = db.prepare(`
    INSERT INTO posts (origem, autor, handle, conteudo, imagem, link, replies, retweets, likes, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const posts = [
    {
      origem: 'Instagram',
      autor: 'National Geographic',
      handle: '@natgeo',
      conteudo:
        'The Amazon rainforest is home to some of the most dramatic landscapes on Earth. From sweeping mountain vistas to deep jungle canyons, its scale is truly breathtaking.',
      imagem:
        'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&auto=format&fit=crop&q=60',
      link: 'https://www.instagram.com/natgeo/',
      replies: '124',
      retweets: '450',
      likes: '12k',
      views: '200k',
    },
    {
      origem: 'Twitter',
      autor: 'Elon Musk',
      handle: '@elonmusk',
      conteudo:
        'Engineering is the closest thing to magic that exists in the real world. Applied science solving complex problems for humanity.',
      imagem: null,
      link: 'https://twitter.com/elonmusk',
      replies: '25k',
      retweets: '45k',
      likes: '320k',
      views: '15M',
    },
    {
      origem: 'Youtube',
      autor: 'Tech Reviewer',
      handle: '@techrev',
      conteudo:
        'Building the ultimate workstation for 2026. This setup is absolute overkill but so satisfying.',
      imagem:
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=60',
      link: 'https://www.youtube.com/',
      replies: '890',
      retweets: '120',
      likes: '15k',
      views: '1.2M',
    },
    {
      origem: 'Instagram',
      autor: 'Traveler',
      handle: '@worldtraveler',
      conteudo:
        'Kyoto mornings. The silence of the temples is something everyone should experience.',
      imagem:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60',
      link: 'https://www.instagram.com/',
      replies: '45',
      retweets: '12',
      likes: '850',
      views: '12k',
    },
    {
      origem: 'Noticia',
      autor: 'G1 Tecnologia',
      handle: '@g1',
      conteudo:
        'Nova legislação sobre inteligência artificial é aprovada e deve entrar em vigor no próximo semestre, definindo regras para uso de dados e transparência de algoritmos.',
      imagem:
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
      link: 'https://g1.globo.com/tecnologia/',
      replies: '320',
      retweets: '1.5k',
      likes: '4.2k',
      views: '500k',
    },
  ]

  for (const p of posts) {
    insert.run(
      p.origem,
      p.autor,
      p.handle,
      p.conteudo,
      p.imagem,
      p.link,
      p.replies,
      p.retweets,
      p.likes,
      p.views
    )
  }

  console.log(`Banco populado com ${posts.length} postagens iniciais.`)
}
