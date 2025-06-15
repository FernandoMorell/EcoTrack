import mongoose from 'mongoose'

const notificacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  leido: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Notificacion = mongoose.model('Notificacion', notificacionSchema)
export default Notificacion
