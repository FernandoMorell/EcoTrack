import { Router } from 'express'
import { userController } from '../controllers/UserController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const usersRouter = Router()

// Middleware para verificar autenticación
usersRouter.use(authMiddleware)
// Obtener límite diario del usuario
usersRouter.get('/:userId/limite', userController.getLimiteDiario)
// Actualizar límite diario del usuario
usersRouter.put('/:userId/limite', userController.updateLimiteDiario)

export default usersRouter
