import { PrismaClient } from '@prisma/client'
import {TransactionTypes} from "~/constants/TransactionTypes";

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
                userId: user.id,
            },
            include: {
                category: true,
            },
        })

        //Calcul du solde de l'utilisateur
        const balance = transactions.reduce((acc, transaction) => {
            return transaction.type === TransactionTypes.NEGATIF
                ? acc - transaction.value // Soustraire pour les transactions négatives
                : acc + transaction.value; // Ajouter pour les transactions positives
        }, 0);

        return {
            success: true,
            data: {
                transactions,
                balance,
            },
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        })
    }
})
