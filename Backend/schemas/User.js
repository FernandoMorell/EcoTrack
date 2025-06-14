import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: true
  },
  limiteDiario: {
    type: Number,
    default: 0 // 0 significa sin límite
  }
})

const User = mongoose.model('User', userSchema)
export default User
