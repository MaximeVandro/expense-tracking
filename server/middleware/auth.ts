import jwt from 'jsonwebtoken'
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler( async (event) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        })
        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Utilisateur non trouvé',
            })
        }
        event.context.user = user
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Token invalide',
        })
    }
})
