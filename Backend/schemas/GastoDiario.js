import mongoose from 'mongoose'

const gastoDiarioSchema = new mongoose.Schema({
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
    enum: ['Ocio', 'Comida', 'Ropa', 'Otros'],
    lowercase: false,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const GastoDiario = mongoose.model('GastoDiario', gastoDiarioSchema)
export default GastoDiario
