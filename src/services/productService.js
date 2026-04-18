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

export const getAllProductService = async () => {
    // TRAE TODOS LOS PRODUCTOS
    const products =  await Product.find()    
    return products
}

export const updateProductService = async (id, productData) =>{
    const productExist = await Product.findOne({_id: id})
    if(!productExist){
        const error = new Error("No existe el producto")
        error.statusCode = 404
        throw error
    }
    const updateProduct = await Product.findOneAndUpdate(
        {_id: id},
        productData,
        {returnDocument: 'after'}
    )
    return updateProduct
}

export const  deleteProductService = async (id) =>{
    const productExist = await Product.findById(id)
    if(!productExist){
        const error = new Error("No existe el producto")
        error.statusCode = 404
        throw error
    }

    await Product.findByIdAndDelete(id)
    return {
        message: "Producto eliminado exitosamente"
    }
}