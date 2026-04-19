import express from "express"
import { createCategory, getAllCategories, deleteCategory } from "../controllers/categoryController.js"

const categoryRoute = express.Router()

categoryRoute.get("/", getAllCategories)
categoryRoute.post("/", createCategory)
categoryRoute.delete("/:id", deleteCategory)

export default categoryRoute