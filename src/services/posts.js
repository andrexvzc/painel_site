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

// Salva ou remove uma postagem dos salvos.
export async function setSaved(id, salvo) {
  const { data } = await api.patch(`/posts/${id}/salvar`, { salvo })
  return data
}

// Metadados visuais de cada origem (ícone e cor), derivados no front-end.
export const ORIGEM_META = {
  Youtube: { label: 'YouTube', icon: 'fa-brands fa-youtube', color: '#FF0000' },
  Instagram: { label: 'Instagram', icon: 'fa-brands fa-instagram', color: '#E1306C' },
  Twitter: { label: 'Twitter / X', icon: 'fa-brands fa-twitter', color: '#000000' },
  Noticia: { label: 'Notícia', icon: 'fa-solid fa-newspaper', color: '#1d9bf0' },
}
