<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "src/stores/auth";

onMounted(() => {
  // console.clear();
  const authStore = useAuthStore();
  const { carregarToken } = authStore;
  carregarToken();
});
</script>
