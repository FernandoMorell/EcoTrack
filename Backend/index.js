import express, { json } from 'express'
import cors from 'cors'
import usersRouter from './routes/Users.js'
import authRouter from './routes/Auth.js'
import ingresosRouter from './routes/Ingresos.js'
import gastosFijosRouter from './routes/GastosFijos.js'
import gastosDiariosRouter from './routes/GastosDiarios.js'
import infoMesRouter from './routes/InfoMes.js'
import notificacionesRouter from './routes/Notificaciones.js'
import dotenv from 'dotenv'

// Configuración del entorno
const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()

app.use(json())
app.use(cors())
app.disable('x-powered-by')

// Rutas

app.use('/auth', authRouter)

app.use('/users', usersRouter)

app.use('/ingresos', ingresosRouter)

app.use('/gastosfijos', gastosFijosRouter)

app.use('/gastosdiarios', gastosDiariosRouter)

app.use('/infomes', infoMesRouter)

app.use('/notificaciones', notificacionesRouter)

// Lanzar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`)
})
