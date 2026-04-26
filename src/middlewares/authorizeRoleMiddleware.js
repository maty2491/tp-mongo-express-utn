export const authorizeRoleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.userRole

        if (!userRole) {
            return res.status(401).json({ message: "Usuario no autenticado" })
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" })
        }

        next()
    }
}
