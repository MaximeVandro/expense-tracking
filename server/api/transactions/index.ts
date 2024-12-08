import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Vous devez être connecté',
        })
    }

    // Récupérez toutes les transactions pour l'utilisateur connecté
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id, // Utilisez l'ID de l'utilisateur connecté
            },
            include: {
                category: true, // Inclure les informations sur la catégorie si nécessaire
            },
        })

        return {
            success: true,
            data: transactions,
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        })
    }
})
