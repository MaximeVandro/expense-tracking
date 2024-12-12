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
  import {ElMessage} from "element-plus";
  
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
      ElMessage({
        type: 'error',
        message: 'Erreur lors de la connexion',
      });
      console.error('Erreur lors de la connexion', error)
    }
  }
</script>  


<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 20px;
        box-sizing: border-box;
    }


    .login-card {
        max-width: 400px;
        width: 100%;
        padding: 20px;
    }
</style>
