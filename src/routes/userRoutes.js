import express from "express"
import { createUser, deleteUser, getUser, getUserById, logout, updateUser, validateUser } from "../controllers/userController.js"
import { authorizeRoleMiddleware } from "../middlewares/authorizeRoleMiddleware.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"

const userRoute = express.Router()

userRoute.post("/", createUser)
userRoute.post("/login", validateUser)
userRoute.post("/logout", logout)
userRoute.get("/", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), getUser)
userRoute.get("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), getUserById)
userRoute.patch("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), updateUser)
userRoute.delete("/:id", verifyTokenMiddleware, authorizeRoleMiddleware("administrador"), deleteUser)

export default userRoute
