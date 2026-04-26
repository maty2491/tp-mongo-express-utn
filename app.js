import express from "express"
import cors from "cors"
import { PORT } from "./src/config/config.js"
import { connectDB } from "./src/config/db.js"
import productRoute from "./src/routes/productRoutes.js"
import categoryRoute from "./src/routes/categoryRoutes.js"
import userRoute from "./src/routes/userRoutes.js"
import cartRoute from "./src/routes/cartRoutes.js"
import session from "express-session"
const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

connectDB()

// Rutas
app.use("/api/product", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/user", userRoute)
app.use("/api/cart", cartRoute)


app.listen(PORT, () =>{
    console.log(`Server corriendo en puerto ${PORT}`)    
})
