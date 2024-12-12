import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    // Vérification de l'authentification
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorisé : Vous devez être connecté',
        });
    }

    const { id } = await readBody(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'L\'ID de la transaction est requis.',
        });
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: id,
                userId:user.id,
            },
        });
        if (!transaction) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Transaction introuvable.',
            });
        }

        await prisma.transaction.delete({
            where: {
                id: id,
            },
        });
        return {
            success: true,
            message: 'Transaction supprimée avec succès.',
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur',
        });
    }
});
