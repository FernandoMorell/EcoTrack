import mongoose from 'mongoose'

const gastoFijoSchema = new mongoose.Schema({
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

const GastoFijo = mongoose.model('GastoFijo', gastoFijoSchema)
export default GastoFijo
