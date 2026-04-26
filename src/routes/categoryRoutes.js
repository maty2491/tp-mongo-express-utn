import express from "express"
import { createCategory, getAllCategories, deleteCategory, updateCategory } from "../controllers/categoryController.js"
import { authorizeRoleMiddleware } from "../middlewares/authorizeRoleMiddleware.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"

const categoryRoute = express.Router()

categoryRoute.get("/", verifyTokenMiddleware, authorizeRoleMiddleware("administrador", "cliente"), getAllCategories)
categoryRoute.post("/", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), createCategory)
categoryRoute.patch("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), updateCategory)
categoryRoute.put("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), updateCategory)
categoryRoute.delete("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), deleteCategory)

export default categoryRoute
