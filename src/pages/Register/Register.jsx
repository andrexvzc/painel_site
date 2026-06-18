import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { useAuth } from '@store/authStore'
import * as S from '../Auth/Auth.styles'

const Register = () => {
  const navigate = useNavigate()
  const register = useAuth((s) => s.register)
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await register(form.nome, form.email, form.senha)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <S.Wrapper>
      <S.Box onSubmit={handleSubmit}>
        <S.Brand>Painel+</S.Brand>
        <S.Subtitle>Crie sua conta</S.Subtitle>

        {error && <S.ErrorBox>{error}</S.ErrorBox>}

        <Input
          label="Nome"
          type="text"
          name="nome"
          placeholder="Seu nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
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
          placeholder="Mínimo 6 caracteres"
          value={form.senha}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>

        <S.Footer>
          Já tem conta? <Link to="/login">Entrar</Link>
        </S.Footer>
      </S.Box>
    </S.Wrapper>
  )
}

export default Register
