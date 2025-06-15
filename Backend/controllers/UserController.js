import { UserModel } from '../models/Users.js'

export const userController = {
  getLimiteDiario: async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: 'El ID del usuario es requerido' })
    }
    try {
      const limiteDiario = await UserModel.getLimiteDiario(userId)
      res.status(200).json({ limiteDiario })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  updateLimiteDiario: async (req, res) => {
    const { userId } = req.params
    const { limite } = req.body
    if (!userId || !limite) {
      return res.status(400).json({ error: 'El ID del usuario y el límite son requeridos' })
    }
    try {
      const result = await UserModel.updateLimiteDiario(userId, limite)
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  updatePushToken: async (req, res) => {
    const { userId } = req.params
    const { pushToken } = req.body

    if (!userId || !pushToken) {
      return res.status(400).json({ error: 'Se requiere ID de usuario y token de push' })
    }

    try {
      const user = await UserModel.updatePushToken(userId, pushToken)
      res.status(200).json(user)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
