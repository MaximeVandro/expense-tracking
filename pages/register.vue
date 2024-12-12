<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="welcome-text">Créer vous un compte</h2>
      <el-form class="login-form" :model="form" ref="registerForm" :rules="rules" label-width="0px">
        <el-form-item prop="email">
          <el-input
              v-model="form.email"
              placeholder="Adresse mail"
              prefix-icon="Message"
          ></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="Nom d'utilisateur"
              prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="Mot de passe"
              prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input
              v-model="form.password2"
              type="password"
              placeholder="Confirmation du mot de passe"
              prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              size="large"
              round
              block
              @click="onRegister"
          >
            Créer un compte
          </el-button>
        </el-form-item>
      </el-form>
      <NuxtLink to="/login">Déjà un compte ? Cliquez ici pour vous connecter.</NuxtLink>
    </el-card>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import {ElMessage} from "element-plus";

const registerForm = ref(null)

const form = ref({
  email: '',
  username: '',
  password: '',
  password2: '',
})

const rules = {
  email: [
    { required: true, message: "L'adresse email est requise", trigger: 'blur' },
    { type: 'email', message: "L'adresse email n'est pas valide", trigger: 'blur' },
  ],
  username: [
    { required: true, message: "Le nom d'utilisateur est requis", trigger: 'blur' },
    { min: 3, message: 'Au moins 3 caractères', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Le mot de passe est requis', trigger: 'blur' },
    { min: 6, message: 'Au moins 6 caractères', trigger: 'blur' },
  ],
  password2: [
    { required: true, message: 'Veuillez confirmer le mot de passe', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('Les mots de passe ne correspondent pas'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}


const onRegister = async () => {
  registerForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const user = await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: form.value.username,
            email: form.value.email,
            password: form.value.password,
          },
        })

        navigateTo('/login')
      } catch (error) {
        console.error('Erreur lors de la création de l utilisateur', error)
        ElMessage({
          type: 'error',
          message: "Erreur lors de la création d'un compte",
        });
      }
    } else {
      ElMessage({
        type: 'error',
        message: "Erreur lors de la création d'un compte",
      });
    }
  })
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
