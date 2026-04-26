import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false })

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: ["activo", "finalizado", "expirado", "cancelado"],
        default: "activo",
        required: true
    },
    items: {
        type: [cartItemSchema],
        default: []
    },
    total: {
        type: Number,
        default: 0,
        min: 0
    },
    expiresAt: {
        type: Date,
        required: true
    },
    checkedOutAt: {
        type: Date,
        default: null
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

cartSchema.index(
    { user: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "activo" }
    }
)

export default mongoose.model("cart", cartSchema)
