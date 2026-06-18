import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '@pages/Home'
import { Login } from '@pages/Login'
import { Register } from '@pages/Register'
import { useAuth } from '@store/authStore'

// Bloqueia rotas privadas: sem token, redireciona para o login.
const ProtectedRoute = ({ children }) => {
  const token = useAuth((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

// Impede acesso a login/cadastro quando já autenticado.
const PublicOnlyRoute = ({ children }) => {
  const token = useAuth((s) => s.token)
  return token ? <Navigate to="/" replace /> : children
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="*" element={<div>404 - Não encontrado</div>} />
      </Routes>
    </BrowserRouter>
  )
}
