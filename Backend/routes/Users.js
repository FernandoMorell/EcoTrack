import { Router } from 'express'
import { userController } from '../controllers/UserController.js'

const usersRouter = Router()

// Obtener límite diario del usuario
usersRouter.get('/:userId/limite', userController.getLimiteDiario)

// Actualizar límite diario del usuario
usersRouter.put('/:userId/limite', userController.updateLimiteDiario)

export default usersRouter
