import { checkModelExist } from "../helpers/checkExist.js"
import Product from "../models/productModel.js"

export const createProductService = async (productData) => {
    await checkModelExist(Product, { name: productData.name }, false, 400, `Producto ${productData.name} ya existe`)
    // VALIDAR QUE EL PRODUCTO ES UNICO
    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()

    return {
        message: "Producto creado exitosamente",
        data: savedProduct
    }
}

export const getAllProductService = async () => {
    // TRAE TODOS LOS PRODUCTOS
    const products = await Product.find().populate("category")
    return products
}

export const updateProductService = async (id, productData) => {
   await checkModelExist(Product, { _id: id }, true, 404, `Producto no encontrado`)

    const updateProduct = await Product.findOneAndUpdate(
        { _id: id },
        productData,
        { returnDocument: "after", runValidators: true }
    )

    return {
        message: "Producto actualizado exitosamente",
        data: updateProduct
    }
}

export const deleteProductService = async (id) => {
   await checkModelExist(Product, { _id: id }, true, 404, `Producto no encontrado`)

    await Product.findByIdAndDelete(id)
    return {
        message: "Producto eliminado exitosamente"
    }
}

export const getProductByIdService = async (id) => {
    
    const product = await checkModelExist(Product, { _id: id }, true, 404, `Producto no encontrado`)

    return product
}
