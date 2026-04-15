import Product from "../models/productModel.js"

export const createProductService = async (productData) => {
    // VALIDAR QUE EL PRODUCTO ES UNICO
    const {name} = productData
    const productExist = await Product.findOne({name})
    if(productExist){
        const error = new Error(`El producto ${name}, ya existe`)
        error.statusCode = 400
        throw error
    }
    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()
    return savedProduct
}