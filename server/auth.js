import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret-painel-troque-em-producao'
const EXPIRES_IN = '7d'

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: EXPIRES_IN })
}

function readToken(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

// Exige autenticação: bloqueia se não houver token válido
export function requireAuth(req, res, next) {
  const user = readToken(req)
  if (!user) return res.status(401).json({ error: 'Não autenticado' })
  req.user = user
  next()
}

// Autenticação opcional: define req.user se houver token, mas não bloqueia
export function optionalAuth(req, res, next) {
  req.user = readToken(req)
  next()
}
