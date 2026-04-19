import express from "express"
import { PORT } from "./src/config/config.js"
import { connectDB } from "./src/config/db.js"
import productRoute from "./src/routes/productRoutes.js"
import categoryRoute from "./src/routes/categoryRoutes.js"
import userRoute from "./src/routes/userRoutes.js"
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

connectDB()

// Rutas
app.use("/api/product", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/user", userRoute)


app.listen(PORT, () =>{
    console.log(`Server corriendo en puerto ${PORT}`)    
})
