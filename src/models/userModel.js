import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [40, "Por favor ingrese un nombre con menos de 40 caracteres"],
        minLength: [2, "Por favor ingrese un nombre con más de 2 caracteres"],
        trim: true,
        lowecase: true
    },
    lastName: {
        type: String,
        required: true,
        maxLength: [40, "Por favor ingrese un apellido con menos de 40 caracteres"],
        minLength: [2, "Por favor ingrese un apellido con más de 2 caracteres"],
        trim: true,
        lowecase: true
    },
    email: {
        type: String,
        required: true,
        maxLength: [40, "Por favor ingrese un email con menos de 40 caracteres"],
        minLength: [7, "Por favor ingrese un email con más de 2 caracteres"],
        trim: true,
        lowecase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Por favor ingrese un email válido"]
    },
    password: {
        type: String,
        match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}/],
        required: true,
    }
},  {timestamps: true})

export default mongoose.model("user", userSchema)