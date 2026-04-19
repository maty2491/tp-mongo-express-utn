import { createProductService, getAllProductService, updateProductService, deleteProductService, getProductByIdService } from "../services/productService.js"
import {handleError} from "../utils/errorHandler.js"

export const createProduct = async (req, res) => {
    try {
        // SE RECIBE LA INFORMACION DEL CLIENTE
        const productData = req.body
        // MANEJAMOS LA CREACION DEL PRODUCTO
        const savedProduct = await createProductService(productData)
        res.status(201).json(savedProduct)
    } catch (error) {
         handleError(error, res)
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await getAllProductService()
        res.status(200).json(products)
    } catch (error) {
        handleError(error, res)
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductByIdService(id);
        res.status(200).json(product);
    } catch (error) {
        handleError(error, res);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const productData = req.body
        const updatedProduct = await updateProductService(id, productData)
        res.status(201).json(updatedProduct)
    } catch (error) {
         handleError(error, res)
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params
        const result = await deleteProductService(id)
        res.status(201).json(result)
    } catch (error) {
        handleError(error, res)
    }
}