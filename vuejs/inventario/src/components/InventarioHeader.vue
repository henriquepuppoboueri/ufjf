<template>
  <p class="text-h4 text-center q-mt-md">
    {{ props.nome }}
  </p>
</template>

<script setup>
const props = defineProps({ nome: { type: String, default: "" } });
</script>

<style scoped></style>
