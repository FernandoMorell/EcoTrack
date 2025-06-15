import { Router } from 'express'
import { GastosFijosController } from '../controllers/GastosFijosController.js'
import { verificarToken } from '../middleware/authMiddleware.js'

const GastosFijosRouter = Router()
// Middleware para verificar el token de acceso
GastosFijosRouter.use(verificarToken)
// Obtener todos los GastosFijos del usuario
GastosFijosRouter.get('/:userId', GastosFijosController.getGastosFijos)
// Crear un nuevo GastoFijo
GastosFijosRouter.post('/', GastosFijosController.createGastoFijo)
// Actualizar un GastoFijo existente
GastosFijosRouter.patch('/:id', GastosFijosController.updateGastoFijo)
// Eliminar un GastoFijo existente
GastosFijosRouter.delete('/:id', GastosFijosController.deleteGastoFijo)

export default GastosFijosRouter
