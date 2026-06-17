import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@pages/Home'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="*" element={<div>404 - Não encontrado</div>} />
      </Routes>
    </BrowserRouter>
  )
}
