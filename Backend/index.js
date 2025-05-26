import express, { json } from 'express'
import cors from 'cors'
import usersRouter from './routes/Users.js'
import ingresosRouter from './routes/Ingresos.js'
import gastosFijosRouter from './routes/GastosFijos.js'
import gastosDiariosRouter from './routes/GastosDiarios.js'
import infoMesRouter from './routes/InfoMes.js'
import dotenv from 'dotenv'

const app = express()
const PORT = 3000

dotenv.config()

app.use(json())
app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!')
})

app.use('/auth', usersRouter)

app.use('/ingresos', ingresosRouter)

app.use('/gastosfijos', gastosFijosRouter)

app.use('/gastosdiarios', gastosDiariosRouter)

app.use('/infomes', infoMesRouter)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`)
})
