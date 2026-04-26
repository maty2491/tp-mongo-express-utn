import { checkModelExist } from "../helpers/checkExist.js"
import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const createUserService = async (userData) => {
    const { email } = userData
    await checkModelExist(User, { email }, false, 400, `El usuario con email ${email} ya existe`)

    const newUser = new User({ ...userData, role: "cliente" })
    const savedUser = await newUser.save()

    return {
        message: "Usuario creado exitosamente",
        data: savedUser
    }
}

export const getUserService = async () => {
    const users = await User.find().select("-password")
    return users
}

export const updateUserService = async (id, userData) => {
    await checkModelExist(User, { _id: id }, true, 404, "El usuario no existe")

    if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 10)
    }

    const updateUser = await User.findByIdAndUpdate(
        { _id: id },
        userData,
        { returnDocument: "after", runValidators: true }
    ).select("-password")

    return {
        message: "Usuario actualizado exitosamente",
        data: updateUser
    }
}

export const deleteUserService = async (id) => {
    await checkModelExist(User, { _id: id }, true, 404, "El usuario no existe")
    await User.deleteOne({ _id: id })

    return {
        message: "Usuario eliminado exitosamente"
    }
}

export const getUserByIdService = async (id) => {
    await checkModelExist(User, { _id: id }, true, 404, "El usuario no existe")
    const user = await User.findById(id).select("-password")
    return user
}

export const validateUserService = async (userData) => {
    const { password, email } = userData

    if (!(password && email)) {
        const error = new Error("Falta completar un campo")
        error.statusCode = 400
        throw error
    }

    const userFound = await checkModelExist(User, { email }, true, 404, "El usuario o contraseña son incorrectos")

    if (!bcrypt.compareSync(password, userFound.password)) {
        const error = new Error("El usuario o contraseña son incorrectos")
        error.statusCode = 400
        throw error
    }

    const payload = {
        userId: userFound._id,
        userEmail: userFound.email,
        userRole: userFound.role
    }
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" })

    return {
        message: "Ingresado con éxito",
        token,
        user: {
            id: userFound._id,
            name: userFound.name,
            lastName: userFound.lastName,
            email: userFound.email,
            role: userFound.role
        }
    }
}
