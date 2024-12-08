import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null, // Informations utilisateur (nom, email, etc.)
        token: null as string | null, // Token JWT
    }),

    actions: {
        // Action pour définir l'utilisateur et le token
        setUser(userData: any, token: string) {
            this.user = userData
            this.token = token
        },

        // Action pour déconnecter l'utilisateur
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },
    },

    getters: {
        // Getter pour vérifier si l'utilisateur est connecté
        isLoggedIn: (state) => !!state.token,
    },
})
