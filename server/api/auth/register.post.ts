import prisma from '~/server/services/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validez les données
    if (!body.name || !body.email || !body.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tous les champs sont requis',
        })
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
    })

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Un utilisateur avec cet email existe déjà',
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)
    // Créez un nouvel utilisateur
    return prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
        },
    });
})