import Notificacion from '../schemas/Notificacion.js'
import connectDB from '../db.js'

export class NotificacionModel {
  static async getNotificaciones (userId) {
    await connectDB()
    try {
      const notificaciones = await Notificacion.find({ user: userId })
      return notificaciones || []
    } catch (error) {
      throw new Error('Error al obtener las notificaciones\n')
    }
  }

  static async createNotificacion (titulo, mensaje, user) {
    await connectDB()
    const newNotificacion = new Notificacion({
      titulo,
      mensaje,
      user
    })
    await newNotificacion.save()
    return newNotificacion
  }

  static async marcarLeidaNotificacion (id) {
    await connectDB()
    const notificacion = await Notificacion.findById(id)
    if (!notificacion) {
      throw new Error('Notificación no encontrada\n')
    }
    notificacion.leida = !notificacion.leida // Cambia el estado de leída a no leída o viceversa
    await notificacion.save()
    return notificacion
  }

  static async deleteNotificacion (id) {
    await connectDB()
    const notificacion = await Notificacion.findByIdAndDelete(id)
    if (!notificacion) {
      throw new Error('Notificación no encontrada\n')
    }
    return { message: 'Notificación eliminada correctamente\n' }
  }
}
