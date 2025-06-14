import mongoose from 'mongoose'
import InfoMes from '../schemas/InfoMes.js'
import connectDB from '../db.js'

export class InfoMesModel {
  static async getInfoMes (userId, mes) {
    await connectDB()
    const infoMes = await InfoMes.findOne({ user: userId, mes })
    return infoMes
  }

  static async createInfoMes (mes, user) {
    await connectDB()

    const existingInfoMes = await InfoMes.findOne({ mes, user })
    if (existingInfoMes) throw new Error('Información del mes ya registrada\n')

    const newInfoMes = new InfoMes({ mes, user })
    await newInfoMes.save()
    return newInfoMes
  }

  static async accionGasto (id, gasto, accion) {
    await connectDB()

    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')
    if (accion !== 'add' && accion !== 'remove') {
      throw new Error('Acción inválida. Debe ser "add" o "remove"\n')
    }

    // Determinar tipo de gasto
    const tipoGasto = gasto.tipo || 'Fijo' // Si no tiene tipo, es GastoFijo

    const tiposPermitidos = ['Mensual', 'Anual', 'Extraordinario', 'Ocio', 'Comida', 'Ropa', 'Otros', 'Fijo']

    if (!tiposPermitidos.includes(tipoGasto)) {
      throw new Error(`Tipo de gasto inválido. Debe ser uno de: ${tiposPermitidos.join(', ')}\n`)
    }

    const cantidadActual = existingInfoMes.gastos.get(tipoGasto) || 0

    if (accion === 'add') {
      existingInfoMes.gastos.set(tipoGasto, cantidadActual + gasto.cantidad)
    } else if (accion === 'remove') {
      existingInfoMes.gastos.set(tipoGasto, Math.max(0, cantidadActual - gasto.cantidad))
    }

    await existingInfoMes.save()
    return existingInfoMes
  }

  static async accionIngreso (id, ingreso, accion) {
    await connectDB()

    const existingInfoMes = await InfoMes.findById(id)
    if (!existingInfoMes) throw new Error('Información del mes no existe\n')
    if (ingreso.cantidad <= 0) {
      throw new Error('La cantidad del ingreso debe ser mayor que cero\n')
    }
    if (accion !== 'add' && accion !== 'remove') {
      throw new Error('Acción inválida. Debe ser "add" o "remove"\n')
    }

    if (accion === 'add') {
      // Añadir el ingreso al mapa de ingresos
      existingInfoMes.ingresos += ingreso.cantidad
    }
    if (accion === 'remove') {
      // Eliminar el ingreso del mapa de ingresos
      existingInfoMes.ingresos -= ingreso.cantidad
      if (existingInfoMes.ingresos < 0) {
        existingInfoMes.ingresos = 0 // Asegurarse de que no sea negativo
      }
    }
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

  static async asegurarInfoMes (mes, userId) {
    await connectDB()
    let infoMes = await InfoMes.findOne({ mes, user: userId })
    if (!infoMes) {
      // Crear nuevo InfoMes
      infoMes = new InfoMes({ mes, user: userId })
      // Obtener todos los ingresos y gastos fijos en una sola operación
      const [ingresos, gastosFijos] = await Promise.all([
        mongoose.model('Ingreso').aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, totalIngresos: { $sum: '$cantidad' } } }
        ]),
        mongoose.model('GastoFijo').aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, totalGastosFijos: { $sum: '$cantidad' } } }
        ])
      ])

      // Aplicar los totales al nuevo InfoMes
      if (ingresos.length > 0) {
        infoMes.ingresos = ingresos[0].totalIngresos
      }
      if (gastosFijos.length > 0) {
        infoMes.gastos.set('Fijo', gastosFijos[0].totalGastosFijos)
      }

      await infoMes.save()
    }
    return infoMes
  }

  static async getAllInfoMesByUser (userId) {
    await connectDB()
    const infoMeses = await InfoMes.find({ user: userId })
    return infoMeses
  }
}
