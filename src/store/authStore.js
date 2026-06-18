import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginRequest, registerRequest } from '@services/auth'

// Store de autenticação, persistido em localStorage (chave 'painel-auth').
export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      async login(email, senha) {
        const { token, user } = await loginRequest(email, senha)
        set({ token, user })
      },

      async register(nome, email, senha) {
        const { token, user } = await registerRequest(nome, email, senha)
        set({ token, user })
      },

      logout() {
        set({ token: null, user: null })
      },
    }),
    { name: 'painel-auth' }
  )
)
