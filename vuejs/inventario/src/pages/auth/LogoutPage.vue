<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore();
const { carregando } = storeToRefs(authStore);
const { deslogar } = authStore;
deslogar();
</script>

<template>
  <div v-if="carregando">Deslogando</div>
</template>
