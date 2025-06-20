import mongoose from 'mongoose'

const infoMesSchema = new mongoose.Schema({
  mes: {
    type: String,
    required: true,
    match: /^\d{4}-(0[1-9]|1[0-2])$/ // valida formato YYYY-MM
  },
  ingresos: {
    type: Number,
    required: true,
    default: 0
  },
  gastos: {
    type: Map,
    of: Number,
    required: true,
    default: () => ({
      Fijo: 0,
      Ocio: 0,
      Comida: 0,
      Ropa: 0,
      Transporte: 0,
      Hogar: 0,
      Otros: 0
    })
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const InfoMes = mongoose.model('InfoMes', infoMesSchema)
export default InfoMes
