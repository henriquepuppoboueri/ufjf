<script setup>
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore();
authStore.deslogar();
</script>

<template>
  <div v-if="authStore.carregando">Deslogando</div>
</template>
