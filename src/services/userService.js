import { checkModelExist } from "../helpers/checkExist.js"
import User from '../models/userModel.js'

export const createUserService = async (userData) => {
    const {email} = userData
    await checkModelExist(User, { email }, false, 400, `El usuario con email ${email} ya existe`) 
    const newUser = new User(userData)
    const savedUser = await newUser.save()
    return savedUser
}

export const getUserService = async () => {
    const users = await User.find()
    return users
}

export const updateUserService = async (id, userData) => {
    
    await checkModelExist(User, { _id: id }, true, 404, `El usuario no existe`) 
    const updateUser = await User.findByIdAndUpdate(
        {_id: id},
        userData,
        {returnDocument: "after"}
    )
    return updateUser
}

export const deleteUserService = async (id) => {
    await User.deleteOne({_id: id})
    return {message: "Usuario eliminado"}
}

export const getUserByIdService = async (id) => {
    const user = await User.findById(id)
    return user
}