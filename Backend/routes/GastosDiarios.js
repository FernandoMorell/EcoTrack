import { Router } from 'express'
import { GastosDiariosController } from '../controllers/GastosDiariosController.js'
import { verificarToken } from '../middleware/authMiddleware.js'

const GastosDiariosRouter = Router()
// Middleware para verificar el token de acceso
GastosDiariosRouter.use(verificarToken)
// Obtener todos los GastosDiarios del usuario
GastosDiariosRouter.get('/:userId', GastosDiariosController.getGastosDiarios)
// Crear un nuevo GastoDiario
GastosDiariosRouter.post('/', GastosDiariosController.createGastoDiario)
// Actualizar un GastoDiario existente
GastosDiariosRouter.put('/:id', GastosDiariosController.updateGastoDiario)
// Eliminar un GastoDiario existente
GastosDiariosRouter.delete('/:id', GastosDiariosController.deleteGastoDiario)

export default GastosDiariosRouter
