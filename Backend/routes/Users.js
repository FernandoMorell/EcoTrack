import { Router } from 'express'
import { userController } from '../controllers/UserController.js'
import { verificarToken } from '../middleware/authMiddleware.js'

const usersRouter = Router()

// Middleware para verificar autenticación
usersRouter.use(verificarToken)
// Obtener límite diario del usuario
usersRouter.get('/:userId/limite', userController.getLimiteDiario)
// Actualizar límite diario del usuario
usersRouter.put('/:userId/limite', userController.updateLimiteDiario)
// Actualizar token de push notifications
usersRouter.put('/:userId/push-token', userController.updatePushToken)

export default usersRouter
