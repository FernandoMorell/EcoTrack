import jwt from 'jsonwebtoken'
// Función para verificar el token JWT
export function verificarToken (req, res, next) {
  // Verificar si el token está presente en los headers
  const token = req.headers['x-auth-token']
  if (!token) return res.status(401).json({ error: 'Token requerido' })

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' })
  }
}
