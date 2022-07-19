<script setup>
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore();
authStore.deslogar();
</script>

<template>
  <div>Deslogando</div>
</template>
