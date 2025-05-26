import { IngresoModel } from '../models/Ingresos.js'

export const ingresosController = {
  getIngresos: async (req, res) => {
    const { userId } = req.params
    try {
      const ingresos = await IngresoModel.getIngresos(userId)
      res.status(200).json(ingresos)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createIngreso: async (req, res) => {
    const { nombre, cantidad, tipo, user } = req.body
    try {
      const newIngreso = await IngresoModel.createIngreso(nombre, cantidad, tipo, user)
      res.status(201).json(newIngreso)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  updateIngreso: async (req, res) => {
    const { id } = req.params
    const ingreso = req.body
    try {
      const updatedIngreso = await IngresoModel.updateIngreso(id, ingreso)
      res.status(200).json(updatedIngreso)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteIngreso: async (req, res) => {
    const { id } = req.params
    try {
      const result = await IngresoModel.deleteIngreso(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
