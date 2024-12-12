<template>
  <el-page-header class="header" icon="none">
    <template #content>
      <div class="items-center">
        <h1 class="text">{{user.name}}</h1>
      </div>
    </template>
    <template #extra>
      <div class="items-center">
        <logout-button style="margin-right: 30px;"/>
      </div>
    </template>
  </el-page-header>
</template>

<script setup>
import {onMounted, ref} from "vue";

const user = ref({})
const fetchConnectedUser= async () => {
  try {
    const response = await $fetch('/api/users');
    user.value = response.data.user;
  } catch (error) {
    console.error('Erreur lors de la récupération du user :', error);
  }
};

onMounted(() => {
  fetchConnectedUser();
});
</script>

<style scoped>
.header{
  background-color: #F8F9FA;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  padding: 0 20px 0px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.items-center{
  display: flex;
  align-items: center;
}

.text{
  color: black;
}
</style>