import express from "express"
import { createProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js"

const router = express.Router()

router.post("/", createProduct)
router.get("/", getAllProduct)
router.patch("/:id", updateProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

export default router