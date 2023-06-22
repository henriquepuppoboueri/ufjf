<script setup>
const authStore = useAuthStore();
const { carregando } = storeToRefs(authStore);
const { deslogar } = authStore;
deslogar();
</script>

<template>
  <div v-if="carregando">Deslogando</div>
</template>
