import { createCategoryService, deleteCategoryService, getAllCategoryService, updateCategoryService } from "../services/categoryService.js"
import {handleError} from "../utils/errorHandler.js"

export const getAllCategories = async (req, res) => {
    try {
        const categories = await getAllCategoryService()
        res.status(200).json(categories)
    } catch (error) {
        handleError(error, res)
    }
}

export const createCategory = async (req, res) => {
    try {
        const categoryData = req.body
        const newCategory = await createCategoryService(categoryData)
        res.status(201).json(newCategory)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const categoryData = req.body
        const updatedCategory = await updateCategoryService(id, categoryData)
        res.status(200).json(updatedCategory)
    } catch (error) {
        handleError(error, res)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params
        const deleted = await deleteCategoryService(id)
        res.status(201).json(deleted)
    } catch (error) {
        handleError(error, res)
    }
}
