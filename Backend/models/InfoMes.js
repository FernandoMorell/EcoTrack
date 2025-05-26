import InfoMes from '../schemas/InfoMes.js'
import connectDB from '../db.js'

export class InfoMesModel {
  static async getInfoMes (userId, mes) {
    await connectDB()
    const infoMes = await InfoMes.find({ userId, mes })
    return infoMes
  }

  static async createInfoMes (mes, ingresos, gastos, user) {
    await connectDB()

    const existingInfoMes = await InfoMes.findOne({ mes, user })
    if (existingInfoMes) throw new Error('Información del mes ya registrada\n')

    const newInfoMes = new InfoMes({ mes, ingresos, gastos, user })
    await newInfoMes.save()
    return newInfoMes
  }

  static async addGasto (id, gasto) {
    await connectDB()

    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')

    if (!existingInfoMes.gastos.has(gasto.tipo)) {
      throw new Error('Tipo de gasto inválido. Debe ser Mensual, Anual, Extraordinario, Ocio, Comida, Ropa u Otros\n')
    }

    // Añadir el gasto al mapa de gastos
    existingInfoMes.gastos.set(gasto.tipo, (existingInfoMes.gastos.get(gasto.tipo) || 0) + 1)
    await existingInfoMes.save()
    return existingInfoMes
  }

  static async deleteGasto (id, gasto) {
    await connectDB()
    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')
    if (!existingInfoMes.gastos.has(gasto.tipo)) {
      throw new Error('Tipo de gasto inválido. Debe ser Mensual, Anual, Extraordinario, Ocio, Comida, Ropa u Otros\n')
    }
    // Eliminar el gasto al mapa de gastos
    existingInfoMes.gastos.set(gasto.tipo, (existingInfoMes.gastos.get(gasto.tipo) || 0) - 1)
    await existingInfoMes.save()
    return existingInfoMes
  }

  static async addIngreso (id, ingreso) {
    await connectDB()

    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')
    if (ingreso.cantidad <= 0) {
      throw new Error('La cantidad del ingreso debe ser mayor que cero\n')
    }

    // Añadir el ingtreso
    existingInfoMes.ingresos += ingreso.cantidad
    await existingInfoMes.save()
    return existingInfoMes
  }

  static async deleteIngreso (id, ingreso) {
    await connectDB()

    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')
    if (ingreso.cantidad <= 0) {
      throw new Error('La cantidad del ingreso debe ser mayor que cero\n')
    }

    // Eliminar el ingreso
    existingInfoMes.ingresos -= ingreso.cantidad
    await existingInfoMes.save()
    return existingInfoMes
  }

  static async deleteInfoMes (id) {
    await connectDB()

    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')

    await InfoMes.findByIdAndDelete(id)
    return { message: 'Información del mes eliminada correctamente\n' }
  }
}
