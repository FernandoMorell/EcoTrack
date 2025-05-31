import GastoDiario from '../schemas/GastoDiario.js'
import connectDB from '../db.js'

export class GastoDiarioModel {
  static async getGastosDiarios (userId, _fecha) {
    await connectDB()
    const GastosDiarios = await GastoDiario.find({ user: userId, fecha: _fecha })
    if (!GastosDiarios) throw new Error('No se encontraron gastos diarios para la fecha proporcionada\n')
    return GastosDiarios
  }

  static async createGastoDiario (nombre, cantidad, tipo, fecha, user) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findOne({ nombre, user, fecha })
    if (existingGastoDiario) throw new Error('GastoDiario ya registrado\n')

    if (tipo !== 'Ocio' && tipo !== 'Comida' && tipo !== 'Ropa' && tipo !== 'Otros') {
      throw new Error('Tipo de GastoDiario inválido. Debe ser Ocio, Comida, Ropa o Otros\n')
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero\n')
    }

    const newGastoDiario = new GastoDiario({ nombre, cantidad, tipo, fecha, user })
    await newGastoDiario.save()
    return newGastoDiario
  }

  static async updateGastoDiario (id, { nombre, cantidad, tipo }) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findById(id)
    if (!existingGastoDiario) throw new Error('GastoDiario no existe\n')

    if (nombre !== undefined) {
      const duplicate = await GastoDiario.findOne({ nombre, user: existingGastoDiario.user, _id: { $ne: id } })
      if (duplicate) throw new Error('Ya existe un gasto diario con ese nombre\n')
      existingGastoDiario.nombre = nombre
    }

    if (cantidad !== undefined) {
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor que cero\n')
      existingGastoDiario.cantidad = cantidad
    }
    if (tipo !== undefined) {
      if (tipo !== 'Ocio' && tipo !== 'Comida' && tipo !== 'Ropa' && tipo !== 'Otros') {
        throw new Error('Tipo de GastoDiario inválido. Debe ser Ocio, Comida, Ropa o Otros\n')
      }
      existingGastoDiario.tipo = tipo
    }

    await existingGastoDiario.save()
    return existingGastoDiario
  }

  static async deleteGastoDiario (id) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findOne({ _id: id })
    if (!existingGastoDiario) throw new Error('GastoDiario no existe\n')

    await GastoDiario.findByIdAndDelete(id)
    return { message: 'GastoDiario eliminado correctamente\n' }
  }
}
