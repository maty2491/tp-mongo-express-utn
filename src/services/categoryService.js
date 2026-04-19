import { checkModelExist } from "../helpers/checkExist.js";
import Category from "../models/categoryModel.js"

export const getAllCategoryService = async () => {
    const categories = await Category.find()
    return categories
}

export const createCategoryService = async (name) => {

    await checkModelExist(Category, name, false, 400, `La categoria ya existe`)
    const newCategory = new Category( name )
    const response = await newCategory.save()
    return response
}

export const deleteCategoryService = async (id) => {

    await checkModelExist(Category, { _id: id }, true, 404, `La categoria no existe`)

    const deleted = await Category.findByIdAndDelete(id)
    await Product.updateMany(
        { category: id },
        { $set: { category: null } }
    )
    return deleted
}