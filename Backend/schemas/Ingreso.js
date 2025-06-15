import mongoose from 'mongoose'

export const ingresoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Ingreso = mongoose.model('Ingreso', ingresoSchema)
export default Ingreso
