import mongoose from 'mongoose'

const ingresoschema = new mongoose.Schema({
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

const Ingreso = mongoose.model('Ingreso', ingresoschema)
export default Ingreso
