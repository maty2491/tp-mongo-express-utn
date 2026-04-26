import { checkModelExist } from "../helpers/checkExist.js";
import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"

export const getAllCategoryService = async () => {
    const categories = await Category.find()
    return categories
}

export const createCategoryService = async (name) => {
    await checkModelExist(Category, name, false, 400, `La categoria ya existe`)
    const newCategory = new Category( name )
    const response = await newCategory.save()

    return {
        message: "Categoria creada exitosamente",
        data: response
    }
}

export const updateCategoryService = async (id, categoryData) => {
    await checkModelExist(Category, { _id: id }, true, 404, "La categoria no existe")

    const updatedCategory = await Category.findByIdAndUpdate(
        { _id: id },
        categoryData,
        { returnDocument: "after", runValidators: true }
    )

    return {
        message: "Categoria actualizada exitosamente",
        data: updatedCategory
    }
}

export const deleteCategoryService = async (id) => {

    await checkModelExist(Category, { _id: id }, true, 404, `La categoria no existe`)

    await Category.findByIdAndDelete(id)
    await Product.updateMany(
        { category: id },
        { $set: { category: null } }
    )

    return {
        message: "Categoria eliminada exitosamente"
    }
}
