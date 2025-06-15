import { Router } from 'express'
import { ingresosController } from '../controllers/IngresosController.js'
import { verificarToken } from '../middleware/authMiddleware.js'

const ingresosRouter = Router()
// Middleware para verificar el token de acceso
ingresosRouter.use(verificarToken)
// Obtener todos los ingresos del usuario
ingresosRouter.get('/:userId', ingresosController.getIngresos)
// Crear un nuevo ingreso
ingresosRouter.post('/', ingresosController.createIngreso)
// Actualizar un ingreso existente
ingresosRouter.patch('/:id', ingresosController.updateIngreso)
// Eliminar un ingreso existente
ingresosRouter.delete('/:id', ingresosController.deleteIngreso)

export default ingresosRouter
