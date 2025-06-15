import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    // Conectar a la base de datos MongoDB usando Mongoose
    await mongoose.connect(process.env.MONGO_URI)
  } catch (error) {
    process.exit(1) // Detener la app
  }
}

export default connectDB
