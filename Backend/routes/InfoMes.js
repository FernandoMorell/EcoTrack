import { Router } from 'express'
import { InfoMesController } from '../controllers/InfoMesController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const InfoMesRouter = Router()
// Middleware para verificar el token de acceso
InfoMesRouter.use(authMiddleware)
// Obtener información del mes para un usuario específico
InfoMesRouter.get('/:userId/:mes', InfoMesController.getInfoMes)
// Crear información del mes para un usuario específico
InfoMesRouter.post('/', InfoMesController.createInfoMes)
// Añadir un gasto a la información del mes para un usuario específico
InfoMesRouter.put('/:id/gasto', InfoMesController.addGasto)
// Eliminar un gasto de la información del mes para un usuario específico
InfoMesRouter.delete('/:id/gasto', InfoMesController.deleteGasto)
// Añadir un ingreso a la información del mes para un usuario específico
InfoMesRouter.put('/:id/ingreso', InfoMesController.addIngreso)
// Eliminar un ingreso de la información del mes para un usuario específico
InfoMesRouter.delete('/:id/ingreso', InfoMesController.deleteIngreso)
// Eliminar información del mes para un usuario específico
InfoMesRouter.delete('/:id', InfoMesController.deleteInfoMes)
export default InfoMesRouter
