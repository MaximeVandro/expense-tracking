<template>
  <el-dialog
      title="Ajouter une Transaction"
      v-model="visible"
      width="50%"
  >
    <el-form :model="form">
      <el-form-item label="Description">
        <el-input v-model="form.description" placeholder="Description"></el-input>
      </el-form-item>
      <el-form-item label="Montant">
        <el-input-number v-model="form.value" :min="1" placeholder="Montant"></el-input-number>
      </el-form-item>
      <el-form-item label="Catégorie">
        <el-select v-model="form.categoryId" placeholder="Aucune">
        <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
        ></el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="Date">
        <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Sélectionnez une date"
            :default-value="form.date"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">Annuler</el-button>
      <el-button type="primary" @click="submitTransaction">Ajouter</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const categories = ref([]);
let transactionType = null;

const emit = defineEmits(['transaction-added']);

const form = ref({
  description: null, // Facultatif
  value: 0,          // Par défaut 0
  categoryId: null,  // Facultatif
  date: new Date(),  // Par défaut date du jour
})

const openWithType = async (type) => {
  transactionType = type;
  await fetchCategories(type);
  visible.value = true;
};

const close = () => (visible.value = false)

const submitTransaction = async () => {
  try {
    const requestData = {
      description: form.value.description,
      value: form.value.value,
      type: transactionType,
      categoryId: form.value.categoryId,
      date: form.value.date.toISOString(),
    };

    // Appel à l'API avec fetch
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    // Vérification de la réponse
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.statusMessage || 'Erreur lors de l\'ajout de la transaction');
    }

    // Succès
    emit('transaction-added');
    console.log('Transaction ajoutée avec succès :', result.data);
    close();
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la transaction :', error.message);
    // Gérer l'erreur, par exemple afficher une notification
  }
};

const fetchCategories = async (type) => {
  try {
    const response = await fetch(`/api/categories?type=${type}`);
    const result = await response.json();

    if (result.success) {
      categories.value = result.data; // Charger les catégories dans la liste
    } else {
      throw new Error('Erreur lors de la récupération des catégories');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error.message);
  }
};

// Permet au parent de contrôler l'ouverture/fermeture
defineExpose({ openWithType, close })
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
