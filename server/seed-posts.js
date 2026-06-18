/**
 * Seed em massa: gera 4000 postagens (1000 Instagram, 1000 Twitter, 1000 YouTube,
 * 1000 Notícias) distribuídas igualmente entre 20 tópicos (50 por tópico/origem),
 * gravando o tópico de cada postagem na coluna `topico`.
 *
 * As notícias são atribuídas a G1, The New York Times, BBC News Brasil, UOL e
 * Al Jazeera, com manchetes em PT-BR. O conteúdo é representativo (sintético),
 * não raspado de artigos reais. Imagens são placeholders do picsum.photos.
 *
 * Uso:  node seed-posts.js          (mantém o que já existe e adiciona 4000)
 *       node seed-posts.js --reset  (apaga todas as postagens antes de gerar)
 */
import { db, initDb } from './db.js'

initDb()

const RESET = process.argv.includes('--reset')

/* ------------------------------- Utilidades ------------------------------ */

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr, i) => arr[i % arr.length]
const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Abrevia números como no front-end (k para milhares, mi para milhões)
function abreviar(num) {
  if (num < 1000) return String(num)
  const fmt = (v, suf) => {
    const a = Math.round(v * 10) / 10
    return (Number.isInteger(a) ? String(a) : a.toFixed(1).replace('.', ',')) + suf
  }
  return num < 1e6 ? fmt(num / 1000, 'k') : fmt(num / 1e6, 'mi')
}

function slug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const idYoutube = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  return Array.from({ length: 11 }, () => chars[randInt(0, chars.length - 1)]).join('')
}

/* --------------------------------- Tópicos ------------------------------- */

const TOPICOS = [
  { nome: 'Tecnologia', tag: 'tecnologia', subs: ['smartphones dobráveis', 'chips de 2 nanômetros', 'notebooks ultrafinos', 'realidade aumentada', 'conectividade 5G', 'computação quântica', 'wearables', 'casas inteligentes', 'fones com cancelamento de ruído', 'processadores ARM', 'baterias de estado sólido', 'drones'] },
  { nome: 'Inteligência Artificial', tag: 'ia', subs: ['modelos de linguagem', 'geração de imagens por IA', 'carros autônomos', 'assistentes virtuais', 'IA na medicina', 'deepfakes', 'automação de tarefas', 'ética em IA', 'chatbots', 'visão computacional', 'IA generativa', 'regulação da IA'] },
  { nome: 'Ciência', tag: 'ciencia', subs: ['edição genética CRISPR', 'física de partículas', 'novos materiais', 'microbiologia', 'energia de fusão', 'neurociência', 'descobertas arqueológicas', 'química verde', 'nanotecnologia', 'paleontologia', 'estudos do clima', 'biotecnologia'] },
  { nome: 'Espaço', tag: 'espaco', subs: ['o telescópio James Webb', 'missões a Marte', 'buracos negros', 'foguetes reutilizáveis', 'exoplanetas', 'a Estação Espacial', 'a Lua', 'satélites', 'asteroides', 'galáxias distantes', 'turismo espacial', 'sondas solares'] },
  { nome: 'Política', tag: 'politica', subs: ['as eleições', 'a reforma tributária', 'políticas públicas', 'relações internacionais', 'o Congresso Nacional', 'a democracia', 'direitos civis', 'a diplomacia', 'os debates eleitorais', 'a transparência pública', 'a segurança nacional', 'acordos comerciais'] },
  { nome: 'Economia', tag: 'economia', subs: ['a inflação', 'a taxa de juros', 'o mercado de ações', 'as criptomoedas', 'o emprego', 'o dólar', 'o comércio internacional', 'as startups', 'a inovação financeira', 'o PIB', 'os investimentos', 'os bancos digitais'] },
  { nome: 'Esportes', tag: 'esportes', subs: ['futebol', 'a Copa do Mundo', 'as Olimpíadas', 'basquete', 'a Fórmula 1', 'tênis', 'vôlei', 'natação', 'atletismo', 'MMA', 'ciclismo', 'esports'] },
  { nome: 'Saúde', tag: 'saude', subs: ['vacinas', 'saúde mental', 'nutrição', 'exercícios físicos', 'doenças crônicas', 'longevidade', 'novos tratamentos', 'qualidade do sono', 'prevenção', 'telemedicina', 'o microbioma', 'saúde da mulher'] },
  { nome: 'Meio Ambiente', tag: 'meioambiente', subs: ['as mudanças climáticas', 'energia solar', 'a preservação da Amazônia', 'os oceanos', 'reciclagem', 'espécies ameaçadas', 'energia eólica', 'o desmatamento', 'água potável', 'a poluição plástica', 'agricultura sustentável', 'créditos de carbono'] },
  { nome: 'Entretenimento', tag: 'entretenimento', subs: ['séries de streaming', 'celebridades', 'premiações', 'reality shows', 'bastidores', 'lançamentos', 'influenciadores', 'a TV', 'teatro', 'grandes eventos', 'tendências virais', 'novelas'] },
  { nome: 'Música', tag: 'musica', subs: ['novos álbuns', 'shows ao vivo', 'festivais', 'artistas independentes', 'pop', 'rock', 'sertanejo', 'hip hop', 'MPB', 'música eletrônica', 'trilhas sonoras', 'vinis'] },
  { nome: 'Cinema', tag: 'cinema', subs: ['estreias', 'filmes de super-heróis', 'filmes de terror', 'animações', 'o cinema nacional', 'grandes diretores', 'efeitos visuais', 'a bilheteria', 'festivais de cinema', 'roteiros', 'ficção científica', 'documentários'] },
  { nome: 'Games', tag: 'games', subs: ['lançamentos de jogos', 'consoles', 'jogos indie', 'esports', 'realidade virtual', 'RPGs', 'jogos mobile', 'speedruns', 'remakes', 'expansões', 'jogos retrô', 'hardware gamer'] },
  { nome: 'Viagem', tag: 'viagem', subs: ['praias paradisíacas', 'mochilão', 'destinos baratos', 'gastronomia local', 'cidades históricas', 'ecoturismo', 'viagens de carro', 'dicas de aeroporto', 'hospedagens', 'trilhas', 'viagens em família', 'destinos exóticos'] },
  { nome: 'Gastronomia', tag: 'gastronomia', subs: ['receitas rápidas', 'comida de rua', 'confeitaria', 'cozinha vegana', 'vinhos', 'café especial', 'cozinha asiática', 'churrasco', 'fermentação', 'restaurantes', 'doces caseiros', 'temperos'] },
  { nome: 'Moda', tag: 'moda', subs: ['tendências de verão', 'moda sustentável', 'looks do dia', 'sneakers', 'alta-costura', 'moda masculina', 'acessórios', 'brechós', 'semanas de moda', 'streetwear', 'maquiagem', 'cuidados com a pele'] },
  { nome: 'Educação', tag: 'educacao', subs: ['ensino a distância', 'métodos de estudo', 'aprendizado de idiomas', 'o ENEM', 'educação infantil', 'tecnologia na sala de aula', 'bolsas de estudo', 'leitura', 'a neurociência da aprendizagem', 'universidades', 'cursos online', 'educação financeira'] },
  { nome: 'Negócios', tag: 'negocios', subs: ['empreendedorismo', 'marketing digital', 'liderança', 'produtividade', 'trabalho remoto', 'vendas', 'gestão de equipes', 'franquias', 'e-commerce', 'branding', 'negociação', 'inovação corporativa'] },
  { nome: 'Cultura', tag: 'cultura', subs: ['literatura', 'artes visuais', 'museus', 'história', 'fotografia', 'poesia', 'dança', 'patrimônio cultural', 'quadrinhos', 'exposições', 'o folclore brasileiro', 'filosofia'] },
  { nome: 'Automóveis', tag: 'automoveis', subs: ['carros elétricos', 'SUVs', 'motos', 'carros clássicos', 'test drives', 'tecnologia automotiva', 'carros esportivos', 'manutenção', 'carros populares', 'pickups', 'mobilidade urbana', 'carros autônomos'] },
]

/* ------------------------------- Templates ------------------------------- */

const TPL_INSTAGRAM = [
  '✨ {sub} como você nunca viu. Salva esse post! #{tag}',
  'Bastidores de {sub} 📸 Quem mais ama esse assunto?',
  'Quem mais é apaixonado por {sub}? 💛 Conta aqui nos comentários.',
  'Um dia inteiro explorando {sub}. {topico} é vida! 🌟',
  'Antes e depois: {sub} que mudou tudo 🔥 #{tag}',
  'Dica rápida de {topico}: tudo o que você precisa saber sobre {sub}.',
  'Esse clique de {sub} merecia o feed ❤️ #{tag}',
  'Carrossel completo sobre {sub} 👉 arrasta para o lado!',
  '{sub} no detalhe. A {topico} está cada vez mais incrível.',
  'Marca aquele amigo que ama {sub}! 🙌 #{tag}',
  'Hoje o assunto é {sub}. O que você achou? 👀',
  'Inspiração do dia: {sub} 💫 #{tag}',
]

const TPL_TWITTER = [
  'Opinião impopular sobre {sub}: ainda subestimamos o impacto na {topico}. 🧵',
  '{sub} mudou completamente nos últimos anos. Quem mais notou?',
  'Acabei de ler sobre {sub} e fiquei pensando no futuro da {topico}.',
  'Thread 🧵 sobre {sub} — por que isso importa para a {topico}:',
  'Ninguém está falando o suficiente sobre {sub}.',
  '{sub} é, disparado, o tema mais interessante de {topico} agora.',
  'Hot take: {sub} vai redefinir a {topico} até 2030.',
  'Lembrete de que {sub} existe e é incrível. #{tag}',
  'A cada dia me convenço mais de que {sub} é o futuro da {topico}.',
  'Polêmico: {sub} está sendo mal interpretado por todo mundo.',
  'Dados novos sobre {sub} acabaram de sair. Impressionante.',
  'Resumo do dia em {topico}: {sub} dominou as conversas.',
]

const TPL_YOUTUBE = [
  'Eu testei {sub} por 30 dias — e o resultado me surpreendeu',
  'A VERDADE sobre {sub} que ninguém te conta | {topico}',
  '{sub} explicado em 10 minutos',
  'TOP 10 fatos sobre {sub} que vão te chocar',
  'Como {sub} está mudando a {topico} em 2026',
  'Reagindo a {sub} pela primeira vez!',
  '{sub}: vale a pena? Análise completa',
  'O guia definitivo de {sub} para iniciantes',
  'Passei uma semana com {sub} — vlog completo',
  '{sub} vs o que você esperava | Comparativo',
  'Tudo que mudou em {sub} este ano',
  'Documentário: a história de {sub}',
]

const TPL_NOTICIA = [
  'Especialistas apontam avanços em {sub} e impacto na {topico}',
  'Entenda como {sub} deve transformar a {topico} nos próximos anos',
  'Novo estudo revela tendências de {sub}',
  '{sub}: o que está em jogo para a {topico} global',
  'Análise: os desafios de {sub} em 2026',
  'Governos discutem novas regras para {sub}',
  'Como {sub} afeta o dia a dia das pessoas',
  'Relatório aponta crescimento de {sub} no mundo',
  '{sub} ganha força e divide opiniões de especialistas',
  'O que esperar do futuro de {sub} na {topico}',
  'Investimentos em {sub} batem recorde, diz levantamento',
  '{sub} em foco: cobertura especial sobre {topico}',
]

function preencher(tpl, topico, sub) {
  const txt = tpl
    .replaceAll('{sub}', sub)
    .replaceAll('{topico}', topico.nome.toLowerCase())
    .replaceAll('{tag}', topico.tag)
  return capitalizar(txt)
}

/* --------------------------------- Autores ------------------------------- */

const AUT_INSTAGRAM = [
  { nome: 'Visual Diary', handle: '@visualdiary' }, { nome: 'Daily Lens', handle: '@dailylens' },
  { nome: 'Momentos', handle: '@momentos' }, { nome: 'Explore Mais', handle: '@exploremais' },
  { nome: 'Criativo BR', handle: '@criativobr' }, { nome: 'Inspira Feed', handle: '@inspira.feed' },
  { nome: 'Olhar Urbano', handle: '@olharurbano' }, { nome: 'Coletivo', handle: '@coletivo.oficial' },
  { nome: 'Vida Real', handle: '@vidareal' }, { nome: 'Studio Luz', handle: '@studioluz' },
]

const AUT_TWITTER = [
  { nome: 'Pedro Almeida', handle: '@pedroalmeida' }, { nome: 'Marina Costa', handle: '@marinacosta' },
  { nome: 'Rafael Lima', handle: '@rafalima' }, { nome: 'Juliana Reis', handle: '@jureis' },
  { nome: 'Bruno Tavares', handle: '@btavares' }, { nome: 'Camila Souza', handle: '@camilasouza' },
  { nome: 'Thiago Nunes', handle: '@thiagonunes' }, { nome: 'Aline Martins', handle: '@alinemartins' },
  { nome: 'Lucas Ferreira', handle: '@lucasf' }, { nome: 'Beatriz Rocha', handle: '@biarocha' },
]

const AUT_YOUTUBE = [
  { nome: 'Canal Descomplica', handle: '@descomplica' }, { nome: 'Mundo em Foco', handle: '@mundoemfoco' },
  { nome: 'Análise Pro', handle: '@analisepro' }, { nome: 'Tudo Sobre', handle: '@tudosobre' },
  { nome: 'Review Brasil', handle: '@reviewbrasil' }, { nome: 'Explica Aí', handle: '@explicaai' },
  { nome: 'Ponto de Vista', handle: '@pontodevista' }, { nome: 'Curiosidade+', handle: '@curiosidademais' },
  { nome: 'Top Conteúdo', handle: '@topconteudo' }, { nome: 'Saber Agora', handle: '@saberagora' },
]

const VEICULOS = [
  { nome: 'G1', handle: '@g1', base: 'https://g1.globo.com/' },
  { nome: 'The New York Times', handle: '@nytimes', base: 'https://www.nytimes.com/' },
  { nome: 'BBC News Brasil', handle: '@bbcbrasil', base: 'https://www.bbc.com/portuguese/' },
  { nome: 'UOL', handle: '@uol', base: 'https://www.uol.com.br/' },
  { nome: 'Al Jazeera', handle: '@aljazeera', base: 'https://www.aljazeera.com/pt/' },
]

/* ------------------------------- Geração --------------------------------- */

const ORIGENS_CFG = [
  { origem: 'Instagram', tpl: TPL_INSTAGRAM, autores: AUT_INSTAGRAM, imgProb: 1, veiculo: false },
  { origem: 'Twitter', tpl: TPL_TWITTER, autores: AUT_TWITTER, imgProb: 0.45, veiculo: false },
  { origem: 'Youtube', tpl: TPL_YOUTUBE, autores: AUT_YOUTUBE, imgProb: 1, veiculo: false },
  { origem: 'Noticia', tpl: TPL_NOTICIA, autores: VEICULOS, imgProb: 0.85, veiculo: true },
]

const insert = db.prepare(`
  INSERT INTO posts (origem, autor, handle, conteudo, imagem, link, replies, retweets, likes, views, curtidas, topico)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

let total = 0
let gIdx = 0

if (RESET) {
  db.exec('DELETE FROM saved_posts; DELETE FROM liked_posts; DELETE FROM posts;')
  console.log('Postagens existentes removidas (--reset).')
}

db.exec('BEGIN')
try {
  for (const cfg of ORIGENS_CFG) {
    for (let t = 0; t < TOPICOS.length; t++) {
      const topico = TOPICOS[t]
      for (let i = 0; i < 50; i++) {
        const sub = topico.subs[i % topico.subs.length]
        const tpl = cfg.tpl[Math.floor(i / topico.subs.length) % cfg.tpl.length]
        const conteudo = preencher(tpl, topico, sub)
        const autor = pick(cfg.autores, t * 50 + i)

        const viewsNum = randInt(2000, 20_000_000)
        const curtidas = randInt(20, Math.min(viewsNum, 2_500_000))
        const repliesNum = randInt(0, 60_000)
        const retweetsNum = randInt(0, 200_000)

        const handleSemArroba = autor.handle.replace('@', '')
        let link
        if (cfg.origem === 'Instagram') link = `https://www.instagram.com/${handleSemArroba}/`
        else if (cfg.origem === 'Twitter') link = `https://twitter.com/${handleSemArroba}`
        else if (cfg.origem === 'Youtube') link = `https://www.youtube.com/watch?v=${idYoutube()}`
        else link = `${autor.base}${slug(conteudo)}.html`

        const imagem =
          Math.random() < cfg.imgProb ? `https://picsum.photos/seed/painel${gIdx}/800/600` : null

        insert.run(
          cfg.origem,
          autor.nome,
          autor.handle,
          conteudo,
          imagem,
          link,
          abreviar(repliesNum),
          abreviar(retweetsNum),
          abreviar(curtidas),
          abreviar(viewsNum),
          curtidas,
          topico.nome
        )
        total++
        gIdx++
      }
    }
  }
  db.exec('COMMIT')
} catch (e) {
  db.exec('ROLLBACK')
  throw e
}

// Classifica as 5 postagens originais do seed que ainda estão sem tópico
const backfill = {
  'National Geographic': 'Meio Ambiente',
  'Elon Musk': 'Tecnologia',
  'Tech Reviewer': 'Tecnologia',
  Traveler: 'Viagem',
  'G1 Tecnologia': 'Inteligência Artificial',
}
const upd = db.prepare('UPDATE posts SET topico = ? WHERE autor = ? AND topico IS NULL')
for (const [autor, top] of Object.entries(backfill)) upd.run(top, autor)

const resumo = db
  .prepare('SELECT origem, COUNT(*) AS n FROM posts GROUP BY origem ORDER BY origem')
  .all()
const porTopico = db
  .prepare('SELECT COUNT(DISTINCT topico) AS topicos FROM posts WHERE topico IS NOT NULL')
  .get()

console.log(`\n${total} postagens geradas.`)
console.table(resumo)
console.log(`Tópicos distintos no banco: ${porTopico.topicos}`)
