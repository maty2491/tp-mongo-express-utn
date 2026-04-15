import { createProductService } from "../services/productService.js"

export const createProduct = async (req, res) => {
    try {
        // SE RECIBE LA INFORMACION DEL CLIENTE
        const productData = req.body
        // MANEJAMOS LA CREACION DEL PRODUCTO
        const savedProduct = await createProductService(productData)
        res.status(201).json(savedProduct)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message || "Error de server interno"
        })
        
    }
}