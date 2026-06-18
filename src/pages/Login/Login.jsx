import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { useAuth } from '@store/authStore'
import * as S from '../Auth/Auth.styles'

const Login = () => {
  const navigate = useNavigate()
  const login = useAuth((s) => s.login)
  const [form, setForm] = useState({ email: '', senha: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form.email, form.senha)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível entrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <S.Wrapper>
      <S.Box onSubmit={handleSubmit}>
        <S.Brand>Painel+</S.Brand>
        <S.Subtitle>Entre na sua conta</S.Subtitle>

        {error && <S.ErrorBox>{error}</S.ErrorBox>}

        <Input
          label="E-mail"
          type="email"
          name="email"
          placeholder="voce@email.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Senha"
          type="password"
          name="senha"
          placeholder="••••••••"
          value={form.senha}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <S.Footer>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </S.Footer>
      </S.Box>
    </S.Wrapper>
  )
}

export default Login
