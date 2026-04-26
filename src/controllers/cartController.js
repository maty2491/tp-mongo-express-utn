import {
    addProductToCartService,
    cancelCartService,
    checkoutCartService,
    createCartService,
    getMyCartService,
    removeProductFromCartService,
    updateCartItemService
} from "../services/cartService.js"
import { handleError } from "../utils/errorHandler.js"

export const createCart = async (req, res) => {
    try {
        const response = await createCartService(req.user.userId)
        res.status(201).json(response)
    } catch (error) {
        handleError(error, res)
    }
}

export const getMyCart = async (req, res) => {
    try {
        const response = await getMyCartService(req.user.userId)
        res.status(200).json(response)
    } catch (error) {
        handleError(error, res)
    }
}

export const addProductToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const response = await addProductToCartService(req.user.userId, productId, quantity)
        res.status(200).json(response)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body
        const response = await updateCartItemService(req.user.userId, productId, quantity)
        res.status(200).json(response)
    } catch (error) {
        handleError(error, res)
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.params
        const response = await removeProductFromCartService(req.user.userId, productId)
        res.status(200).json(response)
    } catch (error) {
        handleError(error, res)
    }
}

export const checkoutCart = async (req, res) => {
    try {
        const response = await checkoutCartService(req.user.userId)
        res.status(200).json(response)
    } catch (error) {
        handleError(error, res)
    }
}

export const cancelCart = async (req, res) => {
    try {
        const response = await cancelCartService(req.user.userId)
        res.status(200).json(response)
    } catch (error) {
        handleError(error, res)
    }
}
