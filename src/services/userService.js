import { checkModelExist } from "../helpers/checkExist.js"
import User from '../models/userModel.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    if(userData.password){
        userData.password = bcrypt.hashSync(userData.password, 10)
    }
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

export const validateUserService = async (userData) =>{
    const {password, email} = userData
    if(!(password && email)){
        const error = new Error("Falta completar un campo")
        error.statusCode = 400
        throw error
    }
    const userFound = await checkModelExist(User, { email }, true, 404, `El usuario o contraseña son incorrectos`) 
    
    if(!bcrypt.compareSync(password, userFound.password)){
        const error = new Error(`El usuario o contraseña son incorrectos`)
        error.statusCode = 400
        throw error
    }

    //JWT
    const payload = {
        userId: userFound._id,
        userEmail: userFound.email
    }
    const token = jwt.sign(payload, "secret", {expiresIn: "1h"})


    return {message: "Ingresado con éxito", token}
}



