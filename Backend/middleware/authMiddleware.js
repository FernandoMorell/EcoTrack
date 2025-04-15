import jwt from 'jsonwebtoken'

export function verificarToken (req, res, next) {
  const token = req.headers['x-auth-token']
  if (!token) return res.status(401).json({ error: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' })
  }
}
