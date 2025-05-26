import Ingreso from '../schemas/Ingreso.js'
import connectDB from '../db.js'

export class IngresoModel {
  static async getIngresos (userId) {
    await connectDB()
    const ingresos = await Ingreso.find({ user: userId })
    return ingresos
  }

  static async createIngreso (nombre, cantidad, tipo, user) {
    await connectDB()

    const existingIngreso = await Ingreso.findOne({ nombre, user })
    if (existingIngreso) throw new Error('Ingreso ya registrado\n')

    if (tipo !== 'Mensual' && tipo !== 'Anual' && tipo !== 'Extraordinario') {
      throw new Error('Tipo de ingreso inválido. Debe ser Mensual, Anual o Extraordinario\n')
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero\n')
    }

    const newIngreso = new Ingreso({ nombre, cantidad, tipo, user })
    await newIngreso.save()
    return newIngreso
  }

  static async updateIngreso (id, ingreso) {
    await connectDB()

    const existingIngreso = await Ingreso.findOne({ id })
    if (!existingIngreso) throw new Error('Ingreso no existe\n')

    const updatedIngreso = await Ingreso.findByIdAndUpdate(id, ingreso, { new: true })
    return updatedIngreso
  }

  static async deleteIngreso (id) {
    await connectDB()

    const existingIngreso = await Ingreso.findOne({ id })
    if (!existingIngreso) throw new Error('Ingreso no existe\n')

    await Ingreso.findByIdAndDelete(id)
    return { message: 'Ingreso eliminado correctamente\n' }
  }
}
