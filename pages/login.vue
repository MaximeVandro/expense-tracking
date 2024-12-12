<template>
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="welcome-text">Bienvenu sur le site pour tracker vos dépenses</h2>
        <el-form class="login-form">
          <el-form-item>
            <el-input
              v-model="form.email"
              placeholder="Adresse mail"
              prefix-icon="Message"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Mot de passe"
              prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              round
              block
              @click="onLogin"
            >
              Se connecter
            </el-button>
          </el-form-item>
        </el-form>
        <NuxtLink to="/register">Cliquez ici pour créer un compte</NuxtLink>
      </el-card>
    </div>
</template>
  
  
<script setup>
  import { ref } from 'vue'
  
  const form = ref({
    username: '',
    password: '',
    rememberMe: false,
  })

  const onLogin = async () => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: form.value,
      })

      const tokenCookie = useCookie('token')
      tokenCookie.value = response.token

      navigateTo('/')
    } catch (error) {
      console.error('Erreur lors de la connexion', error)
      alert(error?.data?.message || 'Erreur lors de la connexion')
    }
  }
</script>  


<style scoped>
    .login-container {
        display: flex;
        justify-content: center; /* Centre horizontalement */
        align-items: center; /* Centre verticalement */
        height: 100vh; /* Prend toute la hauteur de la fenêtre */
        padding: 20px; /* Assurez-vous que le contenu respire même sur les petits écrans */
        box-sizing: border-box; /* Empêche le dépassement des marges ou paddings */
    }

    /* Limiter la largeur de la carte */
    .login-card {
        max-width: 400px; /* Limite la largeur */
        width: 100%; /* S'assure qu'elle s'adapte aux petits écrans */
        padding: 20px;
    }
</style>
