import { UserModel } from '../models/Users.js'

export const authController = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }
    try {
      const result = await UserModel.registerUser(name, email, password)
      res.status(201).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  loginUser: async (req, res) => {
    const { name, password } = req.body
    if (!name || !password) {
      return res.status(400).json({ error: 'Nombre y contraseña son requeridos' })
    }
    try {
      const { accesstoken, refreshToken, id } = await UserModel.loginUser(name, password)
      res.status(200).json({ accesstoken, refreshToken, id })
    } catch (err) {
      res.status(401).json({ error: err.message })
    }
  },

  logoutUser: async (req, res) => {
    try {
      const result = await UserModel.logoutUser()
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { token } = req.body
      if (!token) return res.status(401).json({ error: 'No token' })

      const accessToken = await UserModel.refreshToken(token)

      return res.status(200).json({ accessToken })
    } catch (err) {
      return res.status(403).json({ error: 'Token inválido' })
    }
  },

  getLimiteDiario: async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: 'El ID del usuario es requerido' })
    }
    try {
      const limiteDiario = await UserModel.getLimiteDiario(userId)
      res.status(200).json({ limiteDiario })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  updateLimiteDiario: async (req, res) => {
    const { userId } = req.params
    const { limiteDiario } = req.body
    if (!userId || limiteDiario === undefined) {
      return res.status(400).json({ error: 'El ID del usuario y el límite son requeridos' })
    }
    try {
      await UserModel.updateLimiteDiario(userId, limiteDiario)
      res.status(200).json({ message: 'Límite diario actualizado correctamente' })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
