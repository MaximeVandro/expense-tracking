import { PrismaClient } from '@prisma/client'
import { TransactionTypes } from '~/constants/TransactionTypes'

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
        { name: 'Nourriture', type: TransactionTypes.NEGATIF, couleur: '#FF6347' },
        { name: 'Transport', type: TransactionTypes.NEGATIF, couleur: '#FFA500' },
        { name: 'Loisir', type: TransactionTypes.NEGATIF, couleur: '#FFD700' },
        { name: 'Don', type: TransactionTypes.NEGATIF, couleur: '#FF69B4' },
        { name: 'Autre', type: TransactionTypes.NEGATIF, couleur: '#A52A2A' },
        { name: 'Salaire', type: TransactionTypes.POSITIF, couleur: '#32CD32' },
        { name: 'Cadeau', type: TransactionTypes.POSITIF, couleur: '#1E90FF' },
        { name: 'Autre', type: TransactionTypes.POSITIF, couleur: '#9400D3' },
    ]

    for (const category of categories) {
        await prisma.transactionCategory.create({ data: category })
        console.log(`Catégorie ajoutée : ${category.name}`)
    }

    console.log('Seed des catégories terminé.')
})
