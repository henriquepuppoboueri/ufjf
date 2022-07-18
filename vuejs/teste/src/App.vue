<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount } from "@vue/runtime-core";
import { useAuthStore } from "./stores/auth";

onBeforeMount(() => {
  const authStore = useAuthStore();
  authStore.carregarToken();
});
</script>
