import { Router } from 'express'
import { authController } from '../controllers/AuthController.js'

const usersRouter = Router()

usersRouter.post('/login', authController.loginUser)

usersRouter.post('/logout', authController.logoutUser)

usersRouter.post('/register', authController.registerUser)

usersRouter.post('/refresh', authController.refreshToken)

export default usersRouter
