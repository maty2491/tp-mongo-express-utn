import express from "express"
import {
    addProductToCart,
    cancelCart,
    checkoutCart,
    createCart,
    getMyCart,
    removeProductFromCart,
    updateCartItem
} from "../controllers/cartController.js"
import { authorizeRoleMiddleware } from "../middlewares/authorizeRoleMiddleware.js"
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js"

const cartRoute = express.Router()

cartRoute.use(verifyTokenMiddleware, authorizeRoleMiddleware("cliente"))

cartRoute.post("/", createCart)
cartRoute.get("/me", getMyCart)
cartRoute.post("/items", addProductToCart)
cartRoute.patch("/items/:productId", updateCartItem)
cartRoute.delete("/items/:productId", removeProductFromCart)
cartRoute.post("/checkout", checkoutCart)
cartRoute.post("/cancel", cancelCart)

export default cartRoute
