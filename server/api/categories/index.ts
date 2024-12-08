import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const type = query.type as string | undefined

    try {
        const whereClause = type
            ? { type: type.toLowerCase() } // Filtre par type si spécifié
            : {}

        const categories = await prisma.transactionCategory.findMany({
            where: whereClause,
        })

        return {
            success: true,
            data: categories,
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        })
    }
})