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

        <el-table
            :data="transactions"
            style="width: 100%"
            :row-style="tableRowStyle"
            :max-height="'calc(100vh - 220px)'"
        >
          <el-table-column label="Montant">
            <template #default="{ row }">
              <span class="transaction-value">
                {{ row.type === TransactionTypes.NEGATIF ? '-' : '+' }}{{ row.value }}€
              </span>

            </template>
          </el-table-column>
          <el-table-column prop="description" label="Description" />
          <el-table-column prop="category.name" label="Categorie" />
          <el-table-column label="Date">
            <template #default="{ row }">
              {{ formatDate(row.date) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="80">
            <template #default="{ row }">
              <el-button
                  icon="Delete"
                  circle
                  size="small"
                  @click="deleteTransaction(row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

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
import MyHeader from "~/components/myHeader.vue";
import {Minus, Plus} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";

const transactions = ref([]);
const balance = ref(0);

const addTransactionDialog = ref(null);

const fetchTransactions = async () => {
  try {
    const response = await $fetch('/api/transactions');
    transactions.value = response.data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    balance.value = response.data.balance
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions :', error);
  }
};

const openModal = (type) => {
  addTransactionDialog.value?.openWithType(type);
};

const tableRowStyle = ({ row }) => {
  if (row.type === TransactionTypes.NEGATIF) {
    return { backgroundColor: 'rgba(255, 0, 0, 0.1)' }; // Rouge clair
  } else if (row.type === TransactionTypes.POSITIF) {
    return { backgroundColor: 'rgba(0, 255, 0, 0.1)' }; // Vert clair
  }
  return {};
};

const deleteTransaction = async (id) => {
  try {
    const confirm = await ElMessageBox.confirm(
        'Êtes-vous sûr de vouloir supprimer cette transaction ?',
        'Confirmation',
        {
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non',
          type: 'warning',
        }
    );
    if (confirm) {
      await $fetch(`/api/transactions`, {
        method: 'DELETE',
        body: { id },
      });
      fetchTransactions();
      ElMessage({
        type: 'success',
        message: 'Transaction supprimée avec succès !',
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction :', error);
  }
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

.transaction-value{
  font-weight: bold;
  font-size: large;
}
</style>
