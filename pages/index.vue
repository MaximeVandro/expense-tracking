<template>
  <div class="transactions-page">
    <el-container>
      <el-header>
        <my-header/>
      </el-header>
      <el-main>
        <div class="balance-container">
          <div class="balance-info">
            <span class="balance-label">Mon Solde :</span>
            <span class="balance-value">{{ balance }}€</span>
          </div>
          <div class="balance-actions">
            <el-button type="success" round class="action-button" @click="openModal(TransactionTypes.POSITIF)">
              <el-icon><Plus /></el-icon>
            </el-button>
            <el-button type="danger" round class="action-button" @click="openModal(TransactionTypes.NEGATIF)">
              <el-icon><Minus /></el-icon>
            </el-button>
          </div>
        </div>
        <TransactionsTable
            :transactions="transactions"
            @transaction-deleted="fetchTransactions"
        />

        <!-- Dialog pour ajouter une transaction -->
        <AddTransactionDialog
            ref="addTransactionDialog"
            @transaction-added="fetchTransactions"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AddTransactionDialog from '~/components/AddTransactionDialog.vue';
import {TransactionTypes} from "~/constants/TransactionTypes.ts";
import MyHeader from "~/components/MyHeader.vue";
import {Minus, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const transactions = ref([]);
const balance = ref(0);

const addTransactionDialog = ref(null);

const fetchTransactions = async () => {
  try {
    const response = await $fetch('/api/transactions');
    transactions.value = response.data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    balance.value = response.data.balance
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'Erreur lors de la récupération des transactions',
    });
  }
};

const openModal = (type) => {
  addTransactionDialog.value?.openWithType(type);
};

onMounted(() => {
  fetchTransactions();
});
</script>

<style scoped>
.transactions-page {
  margin: 0 auto;
  padding: 0px 20px;
}

.balance-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2C3E50;
  color: white;
  border-radius: 10px;
  padding: 20px 30px;
  width: 400px;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
}

.balance-label {
  font-size: 1.2rem;
  font-weight: normal;
}

.balance-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.balance-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-button {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
