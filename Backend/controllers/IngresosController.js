import { IngresoModel } from '../models/Ingresos.js'
import InfoMes from '../schemas/InfoMes.js'

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
    const ingresoActualizado = req.body
    if (!id || !ingresoActualizado) {
      return res.status(400).json({ error: 'El ID y los datos del ingreso son obligatorios' })
    }
    try {
      // Obtener el ingreso original
      const ingresoOriginal = await IngresoModel.getIngresoById(id)
      if (!ingresoOriginal) {
        return res.status(404).json({ error: 'Ingreso no encontrado' })
      }

      // Si cambió la cantidad, actualizar todos los InfoMes
      if (ingresoActualizado.cantidad && ingresoActualizado.cantidad !== ingresoOriginal.cantidad) {
        const diferencia = ingresoActualizado.cantidad - ingresoOriginal.cantidad
        // Actualizar todos los InfoMes del usuario
        await InfoMes.updateMany(
          { user: ingresoOriginal.user },
          { $inc: { ingresos: diferencia } }
        )
      }

      const updatedIngreso = await IngresoModel.updateIngreso(id, ingresoActualizado)
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
