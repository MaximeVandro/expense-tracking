<template>
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
</template>


<script setup>
import {TransactionTypes} from "~/constants/TransactionTypes";
import {ElMessage, ElMessageBox} from "element-plus";

defineProps({
  transactions: {
    required: true,
  },
});

const emit = defineEmits(['transaction-deleted']);

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
      emit("transaction-deleted")
      ElMessage({
        type: 'success',
        message: 'Transaction supprimée avec succès !',
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction :', error);
  }
};

const tableRowStyle = ({ row }) => {
  if (row.type === TransactionTypes.NEGATIF) {
    return { backgroundColor: 'rgba(255, 0, 0, 0.1)' }; // Rouge clair
  } else if (row.type === TransactionTypes.POSITIF) {
    return { backgroundColor: 'rgba(0, 255, 0, 0.1)' }; // Vert clair
  }
  return {};
};
</script>

<style scoped>
.transaction-value{
  font-weight: bold;
  font-size: large;
}
</style>