import { useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
    // Lire le token depuis le cookie
    console.log("dans le auth ")
    const token = useCookie('token').value

    // Liste des routes publiques
    const publicRoutes = ['/login', '/register']

    // Si la route actuelle est publique, ne rien faire
    if (publicRoutes.includes(to.path)) {
        return
    }

    // Rediriger si l'utilisateur n'est pas connecté
    if (!token) {
        console.log("pas de token devrais changer de page ")
        return navigateTo('/login')
    }
})