import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB} from "./src/config/db.js"

dotenv.config()

app.use(cros())
app.use(express.json())

connectDB()