import jwt from 'jsonwebtoken'

export function verifyToken(token){
    try {
       const decoded = jwt.verify(token, "secret")
       return decoded
    } catch (error) {
        console.log("JWT ERROR:", error.message)
        throw error
    }
}