import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Vous devez être connecté pour ajouter une transaction.',
        })
    }

    const body = await readBody(event)

    const { date, type, value, categoryId, description } = body
    if (!type || !value || !date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Les champs "date", "type", et "value" sont requis.',
        })
    }

    try {
        const transaction = await prisma.transaction.create({
            data: {
                date: new Date(date),
                type : type,
                description : description,
                value: parseFloat(value), // Assurez-vous que value est bien un nombre
                userId: user.id, // Lier la transaction à l'utilisateur connecté
                categoryId: categoryId || null, // Optionnel
            },
        })

        return {
            success: true,
            data: transaction,
        };
    } catch (error) {
        //console.log(`avant erreur interne, erreur : ${error}`)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        })
    }
})