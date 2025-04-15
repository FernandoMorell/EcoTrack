import express, { json } from 'express'
import cors from 'cors'
import usersRouter from './routes/users.js'
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`)
})
