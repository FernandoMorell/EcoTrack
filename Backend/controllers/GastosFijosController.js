import { GastoFijoModel } from '../models/GastosFijos.js'

export const GastosFijosController = {
  getGastosFijos: async (req, res) => {
    const { userId } = req.params
    try {
      const GastosFijos = await GastoFijoModel.getGastosFijos(userId)
      res.status(200).json(GastosFijos)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createGastoFijo: async (req, res) => {
    const { nombre, cantidad, tipo, user } = req.body
    try {
      const newGastoFijo = await GastoFijoModel.createGastoFijo(nombre, cantidad, tipo, user)
      res.status(201).json(newGastoFijo)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  updateGastoFijo: async (req, res) => {
    const { id } = req.params
    const GastoFijo = req.body
    try {
      const updatedGastoFijo = await GastoFijoModel.updateGastoFijo(id, GastoFijo)
      res.status(200).json(updatedGastoFijo)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteGastoFijo: async (req, res) => {
    const { id } = req.params
    try {
      const result = await GastoFijoModel.deleteGastoFijo(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
