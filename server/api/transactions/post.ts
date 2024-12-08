import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Vérifier si l'utilisateur est authentifié
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Vous devez être connecté pour ajouter une transaction.',
        })
    }

    // Lire les données du corps de la requête
    const body = await readBody(event)

    // Valider les données requises
    const { date, type, value, categoryId } = body

    if (!type || !value || !date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Les champs "date", "type", et "value" sont requis.',
        })
    }

    // Ajouter la transaction dans la base de données
    try {
        const transaction = await prisma.transaction.create({
            data: {
                date: new Date(date),
                type,
                value: parseFloat(value), // Assurez-vous que value est bien un nombre
                userId: user.id, // Lier la transaction à l'utilisateur connecté
                categoryId: categoryId || null, // Optionnel
            },
        })

        return {
            success: true,
            data: transaction,
        }
    } catch (error) {
        console.error('Erreur lors de la création de la transaction:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        })
    }
})