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


    try {
        const userDto = {
            name : user.name,
            email : user.email,
        }

        return {
            success: true,
            data: {
                user: userDto
            },
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        })
    }
})
