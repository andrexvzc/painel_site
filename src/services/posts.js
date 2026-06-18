import { api } from './api'

// Busca as postagens do banco de dados. origem opcional para filtrar.
export async function getPosts(origem) {
  const params = origem && origem !== 'Tudo' ? { origem } : undefined
  const { data } = await api.get('/posts', { params })
  return data
}

// Busca apenas as postagens salvas.
export async function getSavedPosts() {
  const { data } = await api.get('/posts', { params: { salvos: true } })
  return data
}

// Lista os tópicos disponíveis com a contagem de postagens.
export async function getTopicos() {
  const { data } = await api.get('/topicos')
  return data
}

// Busca as postagens de um tópico, opcionalmente filtradas por origem.
export async function getPostsByTopico(topico, origem) {
  const params = origem ? { topico, origem } : { topico }
  const { data } = await api.get('/posts', { params })
  return data
}

// Salva ou remove uma postagem dos salvos.
export async function setSaved(id, salvo) {
  const { data } = await api.patch(`/posts/${id}/salvar`, { salvo })
  return data
}

// Curte ou descurte uma postagem. Retorna o novo total de curtidas.
export async function setLiked(id, curtido) {
  const { data } = await api.patch(`/posts/${id}/curtir`, { curtido })
  return data
}

// Formata um número de contagem de forma abreviada para exibição.
// Ex.: 850 -> "850", 12000 -> "12k", 4200 -> "4,2k", 1500000 -> "1,5mi".
export function formatContagem(n) {
  const num = Number(n ?? 0)
  if (num < 1000) return String(num)

  const abreviar = (valor, sufixo) => {
    const arred = Math.round(valor * 10) / 10
    const texto = Number.isInteger(arred) ? String(arred) : arred.toFixed(1).replace('.', ',')
    return texto + sufixo
  }

  if (num < 1_000_000) return abreviar(num / 1000, 'k')
  return abreviar(num / 1_000_000, 'mi')
}

// Metadados visuais de cada origem (ícone e cor), derivados no front-end.
export const ORIGEM_META = {
  Youtube: { label: 'YouTube', icon: 'fa-brands fa-youtube', color: '#FF0000' },
  Instagram: { label: 'Instagram', icon: 'fa-brands fa-instagram', color: '#E1306C' },
  Twitter: { label: 'Twitter / X', icon: 'fa-brands fa-twitter', color: '#000000' },
  Noticia: { label: 'Notícia', icon: 'fa-solid fa-newspaper', color: '#1d9bf0' },
}
