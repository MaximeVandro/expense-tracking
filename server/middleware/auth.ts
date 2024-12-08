import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
    const path = event.node.req.url

    // Appliquer uniquement aux routes API
    if (!path?.startsWith('/api/')) {
        return
    }

    // Ignorer les routes publiques comme `/login` ou `/register`
    const publicRoutes = ['/api/auth/register', '/api/auth/login']
    if (publicRoutes.some((route) => path?.startsWith(route))) {
        return
    }

    const token = getCookie(event, 'token') // Lire le token depuis le cookie
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Aucun token',
        })
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    try {
        event.context.user = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Token invalide',
        })
    }
})
