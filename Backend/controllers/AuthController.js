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
      const result = await UserModel.loginUser(name, password)
      res.status(200).json(result)
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
  }
}
