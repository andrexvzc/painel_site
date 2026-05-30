import { BrowserRouter, Routes, Route } from 'react-router-dom'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="*" element={<div>404 - Não encontrado</div>} />
      </Routes>
    </BrowserRouter>
  )
}
