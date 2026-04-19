import mongoose from "mongoose"

const statusEm = ["DISPONIBLE", "NO_DISPONIBLE", "OUTLET"]

const productSchema = new mongoose.Schema({
    //nombre
    name: {
        type: String,
        required: [true, "Nombre requerido"],
        minLength: 2,
        unique: [true, "Ese nombre ya existe y es único"],
        lowercase: true,
        trim: true       
    },
    //precio
    price:{
        type: mongoose.Types.Decimal128,
        required: [true, "Precio requerido"],
        min: [0, "El precio debe ser un número"],
        //Set: asegura el guardado en formato correcto
        set: v=> mongoose.Types.Decimal128.fromString(v.toFixed(2)),
    },
    //descripcion
    description:{
        type: String,
        minLength: 2,
        maxLength: 100,
        lowercase: true,
        trim: true
    },
    //cantidad
    quantity: {
        type: Number,
        min: 1,
        default: 1,        
    },
    //estado
    status: {
        type: String,
        validate: {
            validator: function(value){
                return statusEm.includes(value)
            },
            message: props => `${props.value} no es un estado válido`
        },
        default: statusEm[0]
    },
    //categoria
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", default: null},
    //Destacados
    highlighted: Boolean,
    
    // rango de ganancia
    profitRate:{
        type: Number,
        default: 1.20,
        min: [1, "El profit debe ser mayor a 1"]
    },
    //imagenes
    image: String
},{
    timestamps: true
})

productSchema.virtual("finalPrice").get(function () {
    return this.price * this.profitRate
})

productSchema.set("toJSON", {
    getters: true,
    setters: true,
    virtuals: true
})

export default mongoose.model("products", productSchema)