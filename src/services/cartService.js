import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"
import User from "../models/userModel.js"
import { checkModelExist } from "../helpers/checkExist.js"

const CART_EXPIRATION_MINUTES = 30

const getCartExpirationDate = () => {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + CART_EXPIRATION_MINUTES)
    return expiresAt
}

const getProductUnitPrice = (product) => {
    if (typeof product.finalPrice === "number") {
        return product.finalPrice
    }

    const basePrice = Number(product.price?.toString?.() ?? 0)
    return Number((basePrice * product.profitRate).toFixed(2))
}

const recalculateCart = (cart) => {
    cart.items = cart.items.map((item) => ({
        ...item.toObject?.(),
        subtotal: Number((item.unitPrice * item.quantity).toFixed(2))
    }))
    cart.total = Number(
        cart.items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
    )
    return cart
}

const restoreCartStock = async (cart) => {
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: item.quantity } },
            { new: true }
        )
    }
}

const expireCartIfNeeded = async (cart) => {
    if (!cart || cart.status !== "activo" || cart.expiresAt > new Date()) {
        return cart
    }

    const expiredCart = await Cart.findOneAndUpdate(
        {
            _id: cart._id,
            status: "activo",
            expiresAt: { $lte: new Date() }
        },
        { status: "expirado" },
        { new: true }
    )

    if (expiredCart) {
        await restoreCartStock(expiredCart)
        return expiredCart
    }

    return Cart.findById(cart._id)
}

const ensureCustomerUser = async (userId) => {
    const user = await checkModelExist(User, { _id: userId }, true, 404, "El usuario no existe")

    if (user.role !== "cliente") {
        const error = new Error("Solo los clientes pueden operar carritos")
        error.statusCode = 403
        throw error
    }

    return user
}

const getActiveCartForUser = async (userId) => {
    let cart = await Cart.findOne({ user: userId, status: "activo" }).populate("items.product")
    cart = await expireCartIfNeeded(cart)

    if (cart?.status === "activo") {
        return cart
    }

    return null
}

const buildCartResponse = (cart, message) => ({
    message,
    data: cart
})

export const createCartService = async (userId) => {
    await ensureCustomerUser(userId)

    const existingCart = await getActiveCartForUser(userId)
    if (existingCart) {
        return buildCartResponse(existingCart, "Carrito activo obtenido exitosamente")
    }

    const newCart = await Cart.create({
        user: userId,
        items: [],
        total: 0,
        expiresAt: getCartExpirationDate()
    })

    const populatedCart = await Cart.findById(newCart._id).populate("items.product")
    return buildCartResponse(populatedCart, "Carrito creado exitosamente")
}

export const getMyCartService = async (userId) => {
    await ensureCustomerUser(userId)

    const cart = await getActiveCartForUser(userId)
    if (!cart) {
        const error = new Error("El usuario no tiene un carrito activo")
        error.statusCode = 404
        throw error
    }

    return cart
}

export const addProductToCartService = async (userId, productId, quantity) => {
    await ensureCustomerUser(userId)

    const requestedQuantity = Number(quantity)
    if (!requestedQuantity || requestedQuantity < 1) {
        const error = new Error("La cantidad debe ser mayor o igual a 1")
        error.statusCode = 400
        throw error
    }

    const cartResponse = await createCartService(userId)
    const cart = await Cart.findById(cartResponse.data._id)
    const product = await checkModelExist(Product, { _id: productId }, true, 404, "Producto no encontrado")

    const stockReserved = await Product.findOneAndUpdate(
        { _id: productId, quantity: { $gte: requestedQuantity } },
        { $inc: { quantity: -requestedQuantity } },
        { new: true }
    )

    if (!stockReserved) {
        const error = new Error("Stock insuficiente para agregar el producto al carrito")
        error.statusCode = 400
        throw error
    }

    const unitPrice = getProductUnitPrice(product)
    const existingItem = cart.items.find((item) => item.product.toString() === productId)

    if (existingItem) {
        existingItem.quantity += requestedQuantity
        existingItem.subtotal = Number((existingItem.unitPrice * existingItem.quantity).toFixed(2))
    } else {
        cart.items.push({
            product: product._id,
            name: product.name,
            unitPrice,
            quantity: requestedQuantity,
            subtotal: Number((unitPrice * requestedQuantity).toFixed(2))
        })
    }

    cart.expiresAt = getCartExpirationDate()
    recalculateCart(cart)
    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate("items.product")
    return buildCartResponse(populatedCart, "Producto agregado al carrito exitosamente")
}

export const updateCartItemService = async (userId, productId, quantity) => {
    await ensureCustomerUser(userId)

    const nextQuantity = Number(quantity)
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
        const error = new Error("La cantidad debe ser un entero mayor o igual a 1")
        error.statusCode = 400
        throw error
    }

    const cart = await getActiveCartForUser(userId)
    if (!cart) {
        const error = new Error("El usuario no tiene un carrito activo")
        error.statusCode = 404
        throw error
    }

    const item = cart.items.find((cartItem) => cartItem.product._id.toString() === productId || cartItem.product.toString() === productId)
    if (!item) {
        const error = new Error("El producto no se encuentra en el carrito")
        error.statusCode = 404
        throw error
    }

    const delta = nextQuantity - item.quantity

    if (delta > 0) {
        const stockReserved = await Product.findOneAndUpdate(
            { _id: productId, quantity: { $gte: delta } },
            { $inc: { quantity: -delta } },
            { new: true }
        )

        if (!stockReserved) {
            const error = new Error("Stock insuficiente para actualizar la cantidad")
            error.statusCode = 400
            throw error
        }
    }

    if (delta < 0) {
        await Product.findByIdAndUpdate(
            productId,
            { $inc: { quantity: Math.abs(delta) } },
            { new: true }
        )
    }

    item.quantity = nextQuantity
    item.subtotal = Number((item.unitPrice * item.quantity).toFixed(2))
    cart.expiresAt = getCartExpirationDate()
    recalculateCart(cart)
    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate("items.product")
    return buildCartResponse(populatedCart, "Carrito actualizado exitosamente")
}

export const removeProductFromCartService = async (userId, productId) => {
    await ensureCustomerUser(userId)

    const cart = await getActiveCartForUser(userId)
    if (!cart) {
        const error = new Error("El usuario no tiene un carrito activo")
        error.statusCode = 404
        throw error
    }

    const itemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId || item.product.toString() === productId)
    if (itemIndex === -1) {
        const error = new Error("El producto no se encuentra en el carrito")
        error.statusCode = 404
        throw error
    }

    const [removedItem] = cart.items.splice(itemIndex, 1)

    await Product.findByIdAndUpdate(
        productId,
        { $inc: { quantity: removedItem.quantity } },
        { new: true }
    )

    cart.expiresAt = getCartExpirationDate()
    recalculateCart(cart)
    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate("items.product")
    return buildCartResponse(populatedCart, "Producto removido del carrito exitosamente")
}

export const checkoutCartService = async (userId) => {
    await ensureCustomerUser(userId)

    const cart = await getActiveCartForUser(userId)
    if (!cart) {
        const error = new Error("El usuario no tiene un carrito activo")
        error.statusCode = 404
        throw error
    }

    if (cart.items.length === 0) {
        const error = new Error("No se puede finalizar un carrito vacío")
        error.statusCode = 400
        throw error
    }

    cart.status = "finalizado"
    cart.checkedOutAt = new Date()
    recalculateCart(cart)
    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate("items.product")
    return buildCartResponse(populatedCart, "Compra finalizada exitosamente")
}

export const cancelCartService = async (userId) => {
    await ensureCustomerUser(userId)

    const cart = await getActiveCartForUser(userId)
    if (!cart) {
        const error = new Error("El usuario no tiene un carrito activo")
        error.statusCode = 404
        throw error
    }

    await restoreCartStock(cart)
    cart.status = "cancelado"
    cart.cancelledAt = new Date()
    await cart.save()

    return buildCartResponse(cart, "Carrito cancelado exitosamente")
}
