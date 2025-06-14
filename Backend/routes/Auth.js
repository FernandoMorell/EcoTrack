import { Router } from 'express'
import { authController } from '../controllers/AuthController.js'

const usersRouter = Router()

// Logear un usuario
usersRouter.post('/login', authController.loginUser)
// Hacer logout de un usuario
usersRouter.post('/logout', authController.logoutUser)
// Registrar un nuevo usuario
usersRouter.post('/register', authController.registerUser)
// Refrescar el token de acceso
usersRouter.post('/refresh', authController.refreshToken)

export default usersRouter
