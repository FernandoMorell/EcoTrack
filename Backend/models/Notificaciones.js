import Notificacion from '../schemas/Notificacion.js'
import connectDB from '../db.js'

export class NotificacionModel {
  static async getNotificaciones (userId) {
    await connectDB()
    try {
      const notificaciones = await Notificacion.find({ user: userId })
      return notificaciones || []
    } catch (error) {
      console.error('Error en getNotificaciones:', error)
      throw new Error('Error al obtener las notificaciones')
    }
  }

  static async createNotificacion (titulo, mensaje, user) {
    await connectDB()
    try {
      const newNotificacion = new Notificacion({
        titulo,
        mensaje,
        user
      })
      await newNotificacion.save()
      return newNotificacion
    } catch (error) {
      console.error('Error en createNotificacion:', error)
      throw error
    }
  }

  static async marcarLeidaNotificacion (id) {
    await connectDB()
    try {
      const notificacion = await Notificacion.findById(id)
      if (!notificacion) {
        throw new Error('Notificación no encontrada')
      }
      notificacion.leida = !notificacion.leida // Cambia el estado de leída a no leída o viceversa
      await notificacion.save()
      return notificacion
    } catch (error) {
      console.error('Error en marcarLeidaNotificacion:', error)
      throw error
    }
  }

  static async deleteNotificacion (id) {
    await connectDB()
    try {
      const notificacion = await Notificacion.findByIdAndDelete(id)
      if (!notificacion) {
        throw new Error('Notificación no encontrada')
      }
      return { message: 'Notificación eliminada correctamente' }
    } catch (error) {
      console.error('Error en deleteNotificacion:', error)
      throw error
    }
  }
}
