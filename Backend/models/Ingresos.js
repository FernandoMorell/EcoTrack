import mongoose from 'mongoose'
import { ingresoSchema } from '../schemas/Ingreso.js'
import InfoMes from '../schemas/InfoMes.js'
import connectDB from '../db.js'

const Ingreso = mongoose.model('Ingreso', ingresoSchema)

export const IngresoModel = {
  async createIngreso (nombre, cantidad, user) {
    await connectDB()
    const ingreso = new Ingreso({
      nombre,
      cantidad,
      user
    })
    await InfoMes.updateMany(
      { user },
      { $inc: { ingresos: cantidad } }
    )
    await ingreso.save()
    return ingreso
  },

  async getAllIngresos (user) {
    await connectDB()
    const ingresos = await Ingreso.find({ user })
    return ingresos
  },

  async updateIngreso (id, update) {
    await connectDB()
    const ingreso = await Ingreso.findByIdAndUpdate(id, update, { new: true })
    if (!ingreso) throw new Error('Ingreso no encontrado')
    return ingreso
  },

  async deleteIngreso (id) {
    await connectDB()
    const ingreso = await this.getIngresoById(id)
    if (!ingreso) {
      throw new Error('Ingreso no encontrado')
    }

    // Actualizar todos los InfoMes del usuario en una sola operación
    await InfoMes.updateMany(
      { user: ingreso.user },
      { $inc: { ingresos: -ingreso.cantidad } }
    )
    await Ingreso.findByIdAndDelete(id)
    return { message: 'Ingreso eliminado correctamente\n' }
  },

  async getIngresoById (id) {
    await connectDB()
    const ingreso = await Ingreso.findById(id)
    if (!ingreso) throw new Error('Ingreso no encontrado')
    return ingreso
  }
}
