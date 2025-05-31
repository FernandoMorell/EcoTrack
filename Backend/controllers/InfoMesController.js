import { InfoMesModel } from '../models/InfoMes.js'

export const InfoMesController = {
  getInfoMes: async (req, res) => {
    const { userId } = req.params
    const { mes } = req.query
    if (!userId || !mes) {
      return res.status(400).json({ error: 'El ID de usuario y el mes son obligatorios' })
    }
    try {
      const infoMes = await InfoMesModel.getInfoMes(userId, mes)
      res.status(200).json(infoMes)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createInfoMes: async (req, res) => {
    const { mes, user } = req.body
    if (!mes || !user) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }
    try {
      const newInfoMes = await InfoMesModel.createInfoMes(mes, user)
      res.status(201).json(newInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  accionGasto: async (req, res) => {
    const { id } = req.params
    const gasto = req.body
    const { accion } = req.query
    if (!id || !gasto || !accion) {
      return res.status(400).json({ error: 'El ID, los datos del gasto y la acción son obligatorios' })
    }
    try {
      const updatedInfoMes = await InfoMesModel.accionGasto(id, gasto, accion)
      res.status(200).json(updatedInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  accionIngreso: async (req, res) => {
    const { id } = req.params
    const ingreso = req.body
    const { accion } = req.query
    if (!id || !ingreso || !accion) {
      return res.status(400).json({ error: 'El ID, los datos del ingreso y la acción son obligatorios' })
    }
    try {
      const updatedInfoMes = await InfoMesModel.accionIngreso(id, ingreso, accion)
      res.status(200).json(updatedInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteInfoMes: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'El ID de la información del mes es obligatorio' })
    }
    try {
      const result = await InfoMesModel.deleteInfoMes(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
