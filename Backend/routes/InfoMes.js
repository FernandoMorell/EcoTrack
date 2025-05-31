import { Router } from 'express'
import { InfoMesController } from '../controllers/InfoMesController.js'
import { verificarToken } from '../middleware/authMiddleware.js'

const InfoMesRouter = Router()
// Middleware para verificar el token de acceso
InfoMesRouter.use(verificarToken)
// Obtener información del mes para un usuario específico
InfoMesRouter.get('/:userId', InfoMesController.getInfoMes)
// Crear información del mes para un usuario específico
InfoMesRouter.post('/', InfoMesController.createInfoMes)
// Añadir un gasto a la información del mes para un usuario específico
InfoMesRouter.patch('/:id/gasto', InfoMesController.accionGasto)
// Añadir un ingreso a la información del mes para un usuario específico
InfoMesRouter.put('/:id/ingreso', InfoMesController.accionIngreso)
// Eliminar información del mes para un usuario específico
InfoMesRouter.delete('/:id', InfoMesController.deleteInfoMes)
export default InfoMesRouter
