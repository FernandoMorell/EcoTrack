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
  tipo: {
    type: String,
    required: true,
    enum: ['Mensual', 'Anual', 'Extraordinario'],
    lowercase: false,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Ingreso = mongoose.model('Ingreso', ingresoschema)
export default Ingreso
