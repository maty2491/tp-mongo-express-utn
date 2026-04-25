import express from "express"
import { createUser, deleteUser, getUser, getUserById, updateUser, validateUser } from "../controllers/userController.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"

const userRoute = express.Router()

userRoute.post("/", createUser)
userRoute.get("/", getUser)
userRoute.get("/:id", getUserById)
userRoute.patch("/:id", updateUser)
userRoute.delete("/:id", verifyTokenMiddleware, deleteUser)
userRoute.post("/login", validateUser)

export default userRoute