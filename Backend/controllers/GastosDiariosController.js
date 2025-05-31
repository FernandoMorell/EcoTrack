import { GastoDiarioModel } from '../models/GastosDiarios.js'

export const GastosDiariosController = {
  getGastosDiarios: async (req, res) => {
    const { userId } = req.params
    const { fecha } = req.query
    if (!userId) {
      return res.status(400).json({ error: 'El ID de usuario es obligatorio' })
    }
    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es obligatoria' })
    }
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: 'La fecha no es válida' })
    }
    try {
      const GastosDiarios = await GastoDiarioModel.getGastosDiarios(userId, fecha)
      res.status(200).json(GastosDiarios)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createGastoDiario: async (req, res) => {
    const { nombre, cantidad, tipo, fecha, user } = req.body
    if (!nombre || !cantidad || !tipo || !fecha || !user) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }
    try {
      const newGastoDiario = await GastoDiarioModel.createGastoDiario(nombre, cantidad, tipo, fecha, user)
      res.status(201).json(newGastoDiario)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  updateGastoDiario: async (req, res) => {
    const { id } = req.params
    const GastoDiario = req.body
    if (!id || !GastoDiario) {
      return res.status(400).json({ error: 'El ID y los datos del gasto diario son obligatorios' })
    }
    try {
      const updatedGastoDiario = await GastoDiarioModel.updateGastoDiario(id, GastoDiario)
      res.status(200).json(updatedGastoDiario)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteGastoDiario: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'El ID del gasto diario es obligatorio' })
    }
    try {
      const result = await GastoDiarioModel.deleteGastoDiario(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
