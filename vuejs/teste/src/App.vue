<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { useAuthStore } from "./stores/auth";

onMounted(() => {
  const authStore = useAuthStore();
  authStore.carregarToken();
});
</script>
