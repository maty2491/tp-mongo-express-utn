import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [40, "Por favor ingrese un nombre con menos de 40 caracteres"],
        minLength: [2, "Por favor ingrese un nombre con más de 2 caracteres"],
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        maxLength: [40, "Por favor ingrese un apellido con menos de 40 caracteres"],
        minLength: [2, "Por favor ingrese un apellido con más de 2 caracteres"],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        maxLength: [40, "Por favor ingrese un email con menos de 40 caracteres"],
        minLength: [7, "Por favor ingrese un email con más de 2 caracteres"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Por favor ingrese un email válido"]
    },
    password: {
        type: String,
        match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}/],
        required: true,
    },
    role: {
        type: String,
        enum: ["administrador", "cliente"],
        default: "cliente",
        required: true
    }
},  {timestamps: true})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }

    this.password = bcrypt.hashSync(this.password, 10)
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

export default mongoose.model("user", userSchema)
