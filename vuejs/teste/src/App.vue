<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { useAuthStore } from "src/stores/auth";

onMounted(() => {
  const authStore = useAuthStore();
  const { carregarToken } = authStore;
  carregarToken();
});
</script>
