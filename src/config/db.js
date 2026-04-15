import mongoose from "mongoose"
import { MONGODB_URI } from "./config.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Conexión a la base de datos correctamente");
        
    } catch (error) {
        console.error("Error al conectar a la base datos", error.message)
        process.exit(1)        
    }
}