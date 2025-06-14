import { GastoDiarioModel } from '../models/GastosDiarios.js'
import { InfoMesModel } from '../models/InfoMes.js'

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
      const mes = fecha.substring(0, 7) // Obtiene YYYY-MM de la fecha
      // Asegurar que existe el InfoMes para este mes
      const infoMes = await InfoMesModel.asegurarInfoMes(mes, user)
      // Crear el gasto diario
      const newGastoDiario = await GastoDiarioModel.createGastoDiario(nombre, cantidad, tipo, fecha, user)
      // Actualizar el InfoMes con el nuevo gasto
      await InfoMesModel.accionGasto(infoMes._id, { tipo, cantidad }, 'add')
      res.status(201).json(newGastoDiario)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  updateGastoDiario: async (req, res) => {
    const { id } = req.params
    const gastoActualizado = req.body
    if (!id || !gastoActualizado) {
      return res.status(400).json({ error: 'El ID y los datos del gasto diario son obligatorios' })
    }
    try {
      // Obtener el gasto original
      const gastoOriginal = await GastoDiarioModel.getGastoDiarioById(id)
      if (!gastoOriginal) {
        return res.status(404).json({ error: 'Gasto diario no encontrado' })
      }

      // Obtener el InfoMes correspondiente a la fecha del gasto
      const mes = gastoOriginal.fecha.toISOString().substring(0, 7)
      const infoMes = await InfoMesModel.getInfoMes(gastoOriginal.user, mes)

      if (!infoMes) {
        return res.status(404).json({ error: 'No se encontró la información del mes' })
      }

      // Restar el gasto original del InfoMes
      await InfoMesModel.accionGasto(infoMes._id, {
        tipo: gastoOriginal.tipo,
        cantidad: gastoOriginal.cantidad
      }, 'remove')

      // Actualizar el gasto
      const updatedGastoDiario = await GastoDiarioModel.updateGastoDiario(id, gastoActualizado)

      // Añadir el gasto actualizado al InfoMes
      await InfoMesModel.accionGasto(infoMes._id, {
        tipo: updatedGastoDiario.tipo,
        cantidad: updatedGastoDiario.cantidad
      }, 'add')

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
      // Primero obtenemos el gasto para tener sus datos
      const gasto = await GastoDiarioModel.getGastoDiarioById(id)
      if (!gasto) {
        return res.status(404).json({ error: 'Gasto diario no encontrado' })
      }

      // Obtenemos el InfoMes correspondiente a la fecha del gasto
      const mes = new Date(gasto.fecha).toISOString().substring(0, 7)
      const infoMes = await InfoMesModel.getInfoMesByMonth(mes, gasto.user)
      if (infoMes) {
        // Eliminamos el gasto del InfoMes
        await InfoMesModel.accionGasto(infoMes._id, {
          tipo: gasto.tipo,
          cantidad: gasto.cantidad
        }, 'remove')
      }

      // Finalmente eliminamos el gasto diario
      const result = await GastoDiarioModel.deleteGastoDiario(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
