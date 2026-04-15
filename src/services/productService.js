import Product from "../models/productModel.js"

export const createProductService = async (productData) => {
    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()
    return savedProduct
}