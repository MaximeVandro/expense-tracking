import prisma from '~/server/services/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Valider les champs email et mot de passe
    if (!body.email || !body.password) {
        throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis' })
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé' })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(body.password, user.password)
    if (!isPasswordValid) {
        throw createError({ statusCode: 401, statusMessage: 'Mot de passe incorrect' })
    }

    // Générer un token JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Expiration du token
    )

    // Retourner le token au client
    return {
        message: 'Connexion réussie',
        token,
    }
})
