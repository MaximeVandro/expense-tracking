<template>
  <el-button type="danger" @click="logout">Déconnexion</el-button>
</template>

<script setup>
import { useCookie } from '#app'

const logout = () => {
  // Supprimer le token du cookie
  const tokenCookie = useCookie('token')
  tokenCookie.value = null
  navigateTo('/login')
}
</script>
