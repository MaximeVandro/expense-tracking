import { PrismaClient } from '@prisma/client'
import { TransactionTypes } from '~/constants/transactionTypes'

const prisma = new PrismaClient()

export default defineNitroPlugin(async () => {
    console.log('Vérification des catégories dans la base de données...')

    // Vérifier si des catégories existent déjà
    const existingCategories = await prisma.transactionCategory.findMany()
    if (existingCategories.length > 0) {
        console.log('Les catégories existent déjà. Aucune action requise.')
        return
    }

    // Si aucune catégorie n'existe, insérer les catégories initiales
    const categories = [
        { name: 'Nourriture', type: TransactionTypes.NEGATIF },
        { name: 'Transport', type: TransactionTypes.NEGATIF },
        { name: 'Loisir', type: TransactionTypes.NEGATIF },
        { name: 'Don', type: TransactionTypes.NEGATIF },
        { name: 'Autre', type: TransactionTypes.NEGATIF },
        { name: 'Salaire', type: TransactionTypes.POSITIF },
        { name: 'Cadeau', type: TransactionTypes.POSITIF },
        { name: 'Autre', type: TransactionTypes.POSITIF },
    ]

    for (const category of categories) {
        await prisma.transactionCategory.create({ data: category })
        console.log(`Catégorie ajoutée : ${category.name}`)
    }

    console.log('Seed des catégories terminé.')
})
