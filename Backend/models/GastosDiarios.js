import GastoDiario from '../schemas/GastoDiario.js'
import connectDB from '../db.js'

export class GastoDiarioModel {
  static async getGastosDiarios (userId, _fecha) {
    await connectDB()
    try {
      const startDate = new Date(_fecha)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(_fecha)
      endDate.setHours(23, 59, 59, 999)
      const GastosDiarios = await GastoDiario.find({
        user: userId,
        fecha: {
          $gte: startDate,
          $lte: endDate
        }
      })
      return GastosDiarios || []
    } catch (error) {
      console.error('Error en getGastosDiarios:', error)
      throw new Error('Error al obtener los gastos diarios')
    }
  }

  static async createGastoDiario (nombre, cantidad, tipo, fecha, user) {
    await connectDB()
    try {
      // Validate and parse the date
      const parsedDate = new Date(fecha)
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Fecha inválida')
      }

      // Set the time to start of day to ensure consistent comparison
      parsedDate.setHours(0, 0, 0, 0)

      const tiposValidos = ['Ocio', 'Comida', 'Ropa', 'Transporte', 'Hogar', 'Otros']
      if (!tiposValidos.includes(tipo)) {
        throw new Error('Tipo de GastoDiario inválido. Debe ser Ocio, Comida, Ropa, Transporte, Hogar o Otros')
      }

      if (cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor que cero')
      }

      const newGastoDiario = new GastoDiario({
        nombre,
        cantidad,
        tipo,
        fecha: parsedDate,
        user
      })

      await newGastoDiario.save()
      return newGastoDiario
    } catch (error) {
      console.error('Error en createGastoDiario:', error)
      throw error
    }
  }

  static async updateGastoDiario (id, { nombre, cantidad, tipo }) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findById(id)
    if (!existingGastoDiario) throw new Error('GastoDiario no existe')

    if (nombre !== undefined) {
      const duplicate = await GastoDiario.findOne({
        nombre,
        user: existingGastoDiario.user,
        fecha: {
          $gte: new Date(existingGastoDiario.fecha).setHours(0, 0, 0, 0),
          $lt: new Date(existingGastoDiario.fecha).setHours(23, 59, 59, 999)
        },
        _id: { $ne: id }
      })
      if (duplicate) throw new Error('Ya existe un gasto diario con ese nombre en el mismo día')
      existingGastoDiario.nombre = nombre
    }

    if (cantidad !== undefined) {
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor que cero')
      existingGastoDiario.cantidad = cantidad
    }

    if (tipo !== undefined) {
      const tiposValidos = ['Ocio', 'Comida', 'Ropa', 'Transporte', 'Hogar', 'Otros']
      if (!tiposValidos.includes(tipo)) {
        throw new Error('Tipo de GastoDiario inválido. Debe ser Ocio, Comida, Ropa, Transporte, Hogar o Otros')
      }
      existingGastoDiario.tipo = tipo
    }

    await existingGastoDiario.save()
    return existingGastoDiario
  }

  static async deleteGastoDiario (id) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findById(id)
    if (!existingGastoDiario) throw new Error('GastoDiario no existe')

    await GastoDiario.findByIdAndDelete(id)
    return { message: 'GastoDiario eliminado correctamente' }
  }

  static async getGastoDiarioById (id) {
    await connectDB()
    const gastoDiario = await GastoDiario.findById(id)
    if (!gastoDiario) throw new Error('Gasto diario no encontrado')
    return gastoDiario
  }
}
