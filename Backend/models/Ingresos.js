import { Ingreso } from '../schemas/Ingreso.js'
import InfoMes from '../schemas/InfoMes.js'
import connectDB from '../db.js'

export class IngresoModel {
  static async createIngreso (nombre, cantidad, user) {
    await connectDB()
    const ingreso = new Ingreso({
      nombre,
      cantidad,
      user
    })
    // Actualizar todos los InfoMes del usuario
    await InfoMes.updateMany(
      { user },
      { $inc: { ingresos: cantidad } }
    )
    await ingreso.save()
    return ingreso
  }

  static async getAllIngresos (user) {
    await connectDB()
    try {
      const ingresos = await Ingreso.find({ user })
      return ingresos || []
    } catch (error) {
      throw new Error('Error al obtener los ingresos\n')
    }
  }

  static async updateIngreso (id, { nombre, cantidad }) {
    await connectDB()

    const existingIngreso = await Ingreso.findById(id)
    if (!existingIngreso) throw new Error('Ingreso no encontrado\n')

    if (nombre !== undefined) {
      const existingIngreso = await Ingreso.findOne({ nombre, user: { $ne: id } })
      if (existingIngreso) throw new Error('Ya existe un ingreso con ese nombre\n')
      existingIngreso.nombre = nombre
    }

    if (cantidad !== undefined) {
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor que cero\n')
      // Actualizar todos los InfoMes del usuario
      await InfoMes.updateMany(
        { user: existingIngreso.user },
        { $inc: { ingresos: cantidad - existingIngreso.cantidad } }
      )
      existingIngreso.cantidad = cantidad
    }

    await existingIngreso.save()
    return existingIngreso
  }

  static async deleteIngreso (id) {
    await connectDB()
    const ingreso = await this.getIngresoById(id)
    if (!ingreso) {
      throw new Error('Ingreso no encontrado\n')
    }

    // Actualizar todos los InfoMes del usuario
    await InfoMes.updateMany(
      { user: ingreso.user },
      { $inc: { ingresos: -ingreso.cantidad } }
    )
    await Ingreso.findByIdAndDelete(id)
    return { message: 'Ingreso eliminado correctamente\n' }
  }

  static async getIngresoById (id) {
    await connectDB()
    const ingreso = await Ingreso.findById(id)
    if (!ingreso) throw new Error('Ingreso no encontrado\n')
    return ingreso
  }
}
