import { InfoMesModel } from '../models/InfoMes.js'

export const InfoMesController = {
  getInfoMes: async (req, res) => {
    const { userId, mes } = req.params
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
    const { mes, ingresos, gastos, user } = req.body
    if (!mes || !ingresos || !gastos || !user) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }
    try {
      const newInfoMes = await InfoMesModel.createInfoMes(mes, ingresos, gastos, user)
      res.status(201).json(newInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  addGasto: async (req, res) => {
    const { id } = req.params
    const gasto = req.body
    if (!id || !gasto) {
      return res.status(400).json({ error: 'El ID y los datos del gasto son obligatorios' })
    }
    try {
      const updatedInfoMes = await InfoMesModel.addGasto(id, gasto)
      res.status(200).json(updatedInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteGasto: async (req, res) => {
    const { id } = req.params
    const gasto = req.body
    if (!id || !gasto) {
      return res.status(400).json({ error: 'El ID y los datos del gasto son obligatorios' })
    }
    try {
      const updatedInfoMes = await InfoMesModel.deleteGasto(id, gasto)
      res.status(200).json(updatedInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  addIngreso: async (req, res) => {
    const { id } = req.params
    const ingreso = req.body
    if (!id || !ingreso) {
      return res.status(400).json({ error: 'El ID y los datos del ingreso son obligatorios' })
    }
    try {
      const updatedInfoMes = await InfoMesModel.addIngreso(id, ingreso)
      res.status(200).json(updatedInfoMes)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteIngreso: async (req, res) => {
    const { id } = req.params
    const ingreso = req.body
    if (!id || !ingreso) {
      return res.status(400).json({ error: 'El ID y los datos del ingreso son obligatorios' })
    }
    try {
      const updatedInfoMes = await InfoMesModel.deleteIngreso(id, ingreso)
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
