import { IngresoModel } from '../models/Ingresos.js'

export const ingresosController = {
  getIngresos: async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: 'El ID de usuario es obligatorio' })
    }
    try {
      const ingresos = await IngresoModel.getAllIngresos(userId)
      res.status(200).json(ingresos)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createIngreso: async (req, res) => {
    const { nombre, cantidad, user } = req.body
    if (!nombre || !cantidad || !user) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (nombre, cantidad, user)' })
    }

    try {
      // Crear el ingreso fijo y actualizar todos los InfoMes
      const newIngreso = await IngresoModel.createIngreso(nombre, cantidad, user)
      res.status(201).json(newIngreso)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  updateIngreso: async (req, res) => {
    const { id } = req.params
    const ingreso = req.body
    if (!id || !ingreso) {
      return res.status(400).json({ error: 'El ID y los datos del ingreso son obligatorios' })
    }
    try {
      const updatedIngreso = await IngresoModel.updateIngreso(id, ingreso)
      res.status(200).json(updatedIngreso)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
  deleteIngreso: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'El ID del ingreso es obligatorio' })
    }
    try {
      // Eliminar el ingreso y actualizar todos los InfoMes
      const result = await IngresoModel.deleteIngreso(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
