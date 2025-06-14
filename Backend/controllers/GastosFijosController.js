import { GastoFijoModel } from '../models/GastosFijos.js'
import InfoMes from '../schemas/InfoMes.js'

export const GastosFijosController = {
  getGastosFijos: async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: 'El ID de usuario es obligatorio' })
    }
    try {
      const GastosFijos = await GastoFijoModel.getGastosFijos(userId)
      res.status(200).json(GastosFijos)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
  createGastoFijo: async (req, res) => {
    const { nombre, cantidad, user } = req.body
    if (!nombre || !cantidad || !user) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (nombre, cantidad, user)' })
    }

    try {
      const newGastoFijo = await GastoFijoModel.createGastoFijo(nombre, cantidad, user)
      res.status(201).json(newGastoFijo)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
  updateGastoFijo: async (req, res) => {
    const { id } = req.params
    const gastoActualizado = req.body
    if (!id || !gastoActualizado) {
      return res.status(400).json({ error: 'El ID y los datos del gasto fijo son obligatorios' })
    }
    try {
      // Obtener el gasto original
      const gastoOriginal = await GastoFijoModel.getGastoFijoById(id)
      if (!gastoOriginal) {
        return res.status(404).json({ error: 'Gasto fijo no encontrado' })
      }

      // Si cambió la cantidad, actualizar todos los InfoMes
      if (gastoActualizado.cantidad && gastoActualizado.cantidad !== gastoOriginal.cantidad) {
        const diferencia = gastoActualizado.cantidad - gastoOriginal.cantidad
        // Actualizar todos los InfoMes del usuario
        await InfoMes.updateMany(
          { user: gastoOriginal.user },
          { $inc: { 'gastos.Fijo': diferencia } }
        )
      }

      const updatedGastoFijo = await GastoFijoModel.updateGastoFijo(id, gastoActualizado)
      res.status(200).json(updatedGastoFijo)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
  deleteGastoFijo: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'El ID del gasto fijo es obligatorio' })
    }
    try {
      const result = await GastoFijoModel.deleteGastoFijo(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
