import { NotificacionModel } from '../models/Notificaciones.js'

export const NotificacionesController = {
  getNotificaciones: async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: 'El ID de usuario es obligatorio' })
    }
    try {
      const notificaciones = await NotificacionModel.getNotificaciones(userId)
      res.status(200).json(notificaciones)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  createNotificacion: async (req, res) => {
    const { titulo, mensaje, user } = req.body
    if (!titulo || !mensaje || !user) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (titulo, mensaje, user)' })
    }
    try {
      const nuevaNotificacion = await NotificacionModel.createNotificacion(titulo, mensaje, user)
      res.status(201).json(nuevaNotificacion)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  marcarLeidaNotificacion: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'El ID de la notificación es obligatorio' })
    }
    try {
      const notificacionActualizada = await NotificacionModel.marcarLeidaNotificacion(id)
      res.status(200).json(notificacionActualizada)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  deleteNotificacion: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'El ID de la notificación es obligatorio' })
    }
    try {
      await NotificacionModel.deleteNotificacion(id)
      res.status(204).send()
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
