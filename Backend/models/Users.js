import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../schemas/User.js'
import connectDB from '../db.js'

export class UserModel {
  static async loginUser (name, password) {
    await connectDB()
    const user = await User.findOne({ name })
    if (!user) throw new Error('Usuario no encontrado\n')

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new Error('Contraseña incorrecta\n')

    const accesstoken = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '60m'
    })
    const refreshToken = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    })

    return { accesstoken, refreshToken, id: user._id }
  }

  static async registerUser (name, email, password) {
    await connectDB()
    const existingUser = await User.findOne({ name })
    if (existingUser) {
      if (existingUser.name === name) throw new Error('Nombre de usuario ya registrado\n')
      if (existingUser.email === email) throw new Error('Email ya registrado\n')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    return { message: 'Usuario registrado exitosamente\n' }
  }

  static async logoutUser () {
    // TO DO: Implementar la lógica de cierre de sesión en Frontend
    return { message: 'Sesión cerrada correctamente (simulado)\n' }
  }

  static async refreshToken (token) {
    await connectDB()

    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    if (!user) throw new Error('Token inválido\n')

    const accesstoken = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '60m'
    })

    return accesstoken
  }
}
