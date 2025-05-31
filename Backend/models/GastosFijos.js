import GastoFijo from '../schemas/GastoFijo.js'
import connectDB from '../db.js'

export class GastoFijoModel {
  static async getGastosFijos (userId) {
    await connectDB()
    const GastosFijos = await GastoFijo.find({ user: userId })
    return GastosFijos
  }

  static async createGastoFijo (nombre, cantidad, user) {
    await connectDB()

    const existingGastoFijo = await GastoFijo.findOne({ nombre, user })
    if (existingGastoFijo) throw new Error('GastoFijo ya registrado\n')

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero\n')
    }

    const newGastoFijo = new GastoFijo({ nombre, cantidad, user })
    await newGastoFijo.save()
    return newGastoFijo
  }

  static async updateGastoFijo (id, { nombre, cantidad }) {
    await connectDB()

    const existingGastoFijo = await GastoFijo.findById(id)
    if (!existingGastoFijo) throw new Error('GastoFijo no existe\n')

    if (nombre !== undefined) {
      const duplicate = await GastoFijo.findOne({ nombre, user: existingGastoFijo.user, _id: { $ne: id } })
      if (duplicate) throw new Error('Ya existe un gasto fijo con ese nombre\n')
      existingGastoFijo.nombre = nombre
    }

    if (cantidad !== undefined) {
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor que cero\n')
      existingGastoFijo.cantidad = cantidad
    }

    await existingGastoFijo.save()
    return existingGastoFijo
  }

  static async deleteGastoFijo (id) {
    await connectDB()

    const existingGastoFijo = await GastoFijo.findOne({ _id: id })
    if (!existingGastoFijo) throw new Error('GastoFijo no existe\n')

    await GastoFijo.findByIdAndDelete(id)
    return { message: 'GastoFijo eliminado correctamente\n' }
  }
}
