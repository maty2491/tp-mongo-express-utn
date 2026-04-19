import express from "express"
import { createProduct, deleteProduct, getAllProduct, updateProduct, getProductById } from "../controllers/productController.js"

const productRoute = express.Router()

productRoute.post("/", createProduct)
productRoute.get("/", getAllProduct)
productRoute.get("/:id", getProductById)
productRoute.patch("/:id", updateProduct)
productRoute.put("/:id", updateProduct)
productRoute.delete("/:id", deleteProduct)

export default productRoute