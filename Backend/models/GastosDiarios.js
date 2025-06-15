import GastoDiario from '../schemas/GastoDiario.js'
import InfoMesModel from './InfoMes.js'
import connectDB from '../db.js'

export class GastoDiarioModel {
  static async getGastosDiarios (userId, _fecha) {
    await connectDB()
    try {
      // Se coge la fecha y se ajusta para buscar todos los gastos del día
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
      throw new Error('Error al obtener los gastos diarios\n')
    }
  }

  static async createGastoDiario (nombre, cantidad, tipo, fecha, user) {
    await connectDB()
    // Validar y parsear la fecha
    const parsedDate = new Date(fecha)
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Fecha inválida\n')
    }
    // Poner la fecha a 00:00:00 para evitar problemas de horas
    parsedDate.setHours(0, 0, 0, 0)

    const tiposValidos = ['Ocio', 'Comida', 'Ropa', 'Transporte', 'Hogar', 'Otros']
    if (!tiposValidos.includes(tipo)) {
      throw new Error(`Tipo de GastoDiario inválido. Debe ser: ${tiposValidos.join(', ')}\n`)
    }
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero\n')
    }

    const newGastoDiario = new GastoDiario({
      nombre,
      cantidad,
      tipo,
      fecha: parsedDate,
      user
    })
    // Asegurar que el InfoMes existe y actualizarlo
    const mes = fecha.substring(0, 7)
    const infoMes = await InfoMesModel.asegurarInfoMes(mes, user)
    await InfoMesModel.accionGasto(infoMes._id, { tipo, cantidad }, 'add')

    await newGastoDiario.save()
    return newGastoDiario
  }

  static async updateGastoDiario (id, { nombre, cantidad, tipo }) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findById(id)
    if (!existingGastoDiario) throw new Error('GastoDiario no existe\n')
    // Se obtiene el InfoMes del mes del gasto diario
    const mes = existingGastoDiario.fecha.toISOString().substring(0, 7)
    const infoMes = await InfoMesModel.getInfoMes(existingGastoDiario.user, mes)
    if (!infoMes) throw new Error('InfoMes no encontrado para el usuario\n')

    // Restar el gasto original del InfoMes
    await InfoMesModel.accionGasto(infoMes._id, {
      tipo: existingGastoDiario.tipo,
      cantidad: existingGastoDiario.cantidad
    }, 'remove')
    // Actualizar el GastoDiario con los nuevos datos
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
      if (duplicate) throw new Error('Ya existe un gasto diario con ese nombre en el mismo día\n')
      existingGastoDiario.nombre = nombre
    }

    if (cantidad !== undefined) {
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor que cero\n')
      existingGastoDiario.cantidad = cantidad
    }

    if (tipo !== undefined) {
      const tiposValidos = ['Ocio', 'Comida', 'Ropa', 'Transporte', 'Hogar', 'Otros']
      if (!tiposValidos.includes(tipo)) {
        throw new Error(`Tipo de GastoDiario inválido. Debe ser: ${tiposValidos.join(', ')}\n`)
      }
      existingGastoDiario.tipo = tipo
    }

    // Añadir el gasto actualizado al InfoMes
    await InfoMesModel.accionGasto(infoMes._id, {
      tipo: existingGastoDiario.tipo,
      cantidad: existingGastoDiario.cantidad
    }, 'add')

    await existingGastoDiario.save()
    return existingGastoDiario
  }

  static async deleteGastoDiario (id) {
    await connectDB()

    const existingGastoDiario = await GastoDiario.findById(id)
    if (!existingGastoDiario) throw new Error('GastoDiario no existe\n')

    // Obtenemos el InfoMes correspondiente a la fecha del gasto
    const mes = new Date(existingGastoDiario.fecha).toISOString().substring(0, 7)
    const infoMes = await InfoMesModel.getInfoMesByMonth(mes, existingGastoDiario.user)
    if (!infoMes) throw new Error('InfoMes no encontrado para el usuario\n')
    // Restar el gasto del InfoMes
    await InfoMesModel.accionGasto(infoMes._id, {
      tipo: existingGastoDiario.tipo,
      cantidad: existingGastoDiario.cantidad
    }, 'remove')

    await GastoDiario.findByIdAndDelete(id)
    return { message: 'GastoDiario eliminado correctamente\n' }
  }

  static async getGastoDiarioById (id) {
    await connectDB()
    const gastoDiario = await GastoDiario.findById(id)
    if (!gastoDiario) throw new Error('Gasto diario no encontrado\n')
    return gastoDiario
  }
}
