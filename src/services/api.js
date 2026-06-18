import axios from 'axios'
import { config } from '@config/environment'

export const api = axios.create({
  baseURL: config.apiUrl,
})

// Anexa o token JWT (salvo pelo authStore em localStorage) a cada requisição.
api.interceptors.request.use((req) => {
  const raw = localStorage.getItem('painel-auth')
  if (raw) {
    try {
      const token = JSON.parse(raw)?.state?.token
      if (token) req.headers.Authorization = `Bearer ${token}`
    } catch {
      // ignora JSON inválido
    }
  }
  return req
})

// Se o token expirar/for inválido, limpa a sessão e volta para o login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('painel-auth')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
