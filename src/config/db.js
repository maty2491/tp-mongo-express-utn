import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONOGO_URI)
        console.log("Conexión a la base de datos correctamente");
        
    } catch (error) {
        console.error("Error al conectar a la base datos", error.message)
        process.exit(1)        
    }
}