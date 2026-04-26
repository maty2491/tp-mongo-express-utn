import { verifyToken } from "../utils/verifyToken.js"

export const verifyTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
     
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Acceso con token invalido" })
        }
        const token = authHeader.split(" ")[1]

        const decoded = verifyToken(token)

        req.user = decoded

        next()

    } catch (error) {
        return res.status(400).json({message: "Acceso al token invalido"})        
    }
}