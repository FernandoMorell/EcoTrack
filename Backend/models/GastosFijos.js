import GastoFijo from '../schemas/GastoFijo'
import connectDB from '../db.js'

export class GastoFijoModel {
  static async getGastosFijos (userId) {
    await connectDB()
    const GastosFijos = await GastoFijo.find({ user: userId })
    return GastosFijos
  }

  static async createGastoFijo (nombre, cantidad, tipo, user) {
    await connectDB()

    const existingGastoFijo = await GastoFijo.findOne({ nombre, user })
    if (existingGastoFijo) throw new Error('GastoFijo ya registrado\n')

    if (tipo !== 'Mensual' && tipo !== 'Anual' && tipo !== 'Extraordinario') {
      throw new Error('Tipo de GastoFijo inválido. Debe ser Mensual, Anual o Extraordinario\n')
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero\n')
    }

    const newGastoFijo = new GastoFijo(nombre, cantidad, tipo, user)
    await newGastoFijo.save()
    return newGastoFijo
  }

  static async updateGastoFijo (id, GastoFijo) {
    await connectDB()

    const existingGastoFijo = await GastoFijo.findOne({ id })
    if (!existingGastoFijo) throw new Error('GastoFijo no existe\n')

    const updatedGastoFijo = await GastoFijo.findByIdAndUpdate(id, GastoFijo, { new: true })
    return updatedGastoFijo
  }

  static async deleteGastoFijo (id) {
    await connectDB()

    const existingGastoFijo = await GastoFijo.findOne({ id })
    if (!existingGastoFijo) throw new Error('GastoFijo no existe\n')

    await GastoFijo.findByIdAndDelete(id)
    return { message: 'GastoFijo eliminado correctamente\n' }
  }
}
