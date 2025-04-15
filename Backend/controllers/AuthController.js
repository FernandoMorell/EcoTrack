import { UserModel } from '../models/users.js'

export const authController = {
  registerUser: async (req, res) => {
    const { name, password } = req.body
    try {
      const result = await UserModel.registerUser(name, password)
      res.status(201).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  loginUser: async (req, res) => {
    const { name, password } = req.body

    try {
      const { accesstoken, refreshToken } = await UserModel.loginUser(name, password)
      res.status(200).json({ accesstoken, refreshToken })
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
  }
}
