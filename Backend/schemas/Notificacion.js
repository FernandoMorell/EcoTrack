import mongoose from 'mongoose'

const notificacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio']
  },
  mensaje: {
    type: String,
    required: [true, 'El mensaje es obligatorio']
  },
  leida: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  }
})

const Notificacion = mongoose.model('Notificacion', notificacionSchema)
export default Notificacion
