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

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    })

    return { token }
  }

  static async registerUser (name, password) {
    await connectDB()
    const existingUser = await User.findOne({ name })
    if (existingUser) throw new Error('Usuario ya registrado\n')

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, password: hashedPassword })
    await user.save()

    return { message: 'Usuario registrado exitosamente\n' }
  }

  static async logoutUser () {
    // TO DO: Implementar la lógica de cierre de sesión en Frontend
    return { message: 'Sesión cerrada correctamente (simulado)\n' }
  }
}
