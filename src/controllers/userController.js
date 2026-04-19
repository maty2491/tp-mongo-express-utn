import { createUserService, deleteUserService, getUserByIdService, getUserService, updateUserService } from "../services/userService.js"
import { handleError } from "../utils/errorHandler.js"

export const createUser = async (req, res) => {
    try {
        const userData = req.body
        const newUser = await createUserService(userData)
        res.status(201).json({ message: "Usuario creado exitosamente", data: newUser })
    } catch (error) {
        handleError(error, res)
    }
}

export const getUser = async (req, res) => {
    try {
        const users = await getUserService()
        res.status(200).json(users)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const userData = req.body

        const updatedUser = await updateUserService(id, userData)
        res.status(201).json(updateUser)
    } catch (error) {
        handleError(error, res)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const deleteUser = await deleteUserService(id)
        res.status(201).json(deleteUser)
    } catch (error) {
        handleError(error, res)
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserByIdService(id)
        res.status(200).json(user)
    } catch (error) {
        handleError(error, res)
    }
}