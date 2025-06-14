import { Router } from 'express'
import { NotificacionesController } from '../controllers/NotificacionesController.js'
import { verificarToken } from '../middleware/authMiddleware.js'

const NotificacionesRouter = Router()
// Middleware para verificar el token de acceso
NotificacionesRouter.use(verificarToken)
// Obtener todas las notificaciones del usuario
NotificacionesRouter.get('/:userId', NotificacionesController.getNotificaciones)
// Crear una nueva notificación
NotificacionesRouter.post('/', NotificacionesController.createNotificacion)
// Marcar leida una notificación existente
NotificacionesRouter.put('/:id/leida', NotificacionesController.marcarLeidaNotificacion)
// Eliminar una notificación existente
NotificacionesRouter.delete('/:id', NotificacionesController.deleteNotificacion)

export default NotificacionesRouter
