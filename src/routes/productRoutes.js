import express from "express"
import { createProduct, deleteProduct, getAllProduct, updateProduct, getProductById } from "../controllers/productController.js"
import { authorizeRoleMiddleware } from "../middlewares/authorizeRoleMiddleware.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"

const productRoute = express.Router()

productRoute.get("/", verifyTokenMiddleware, authorizeRoleMiddleware("administrador", "cliente"), getAllProduct)
productRoute.get("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador", "cliente"), getProductById)
productRoute.post("/", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), createProduct)
productRoute.patch("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), updateProduct)
productRoute.put("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), updateProduct)
productRoute.delete("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), deleteProduct)

export default productRoute
