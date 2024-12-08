
<template>
  <div class="categories-page">
    <h1>Catégories Positives</h1>
    <el-table :data="categories" style="width: 100%">
      <el-table-column prop="name" label="Nom" />
      <el-table-column prop="type" label="Type" />
    </el-table>
  </div>
  <logout-button/>
</template>

<script setup>
import {TransactionTypes} from "~/constants/transactionTypes.ts";

definePageMeta({
  middleware: 'auth',
})

import { ref, onMounted } from 'vue'

const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/categories', {
      params: { type: TransactionTypes.POSITIF },
    })
    categories.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories positives:', error)
  }
}

onMounted(() => {
  fetchCategories();
})
</script>

<style scoped>
.categories-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>