<template>
  <p class="text-h4 text-center q-mt-md">
    {{ nome }}
  </p>
</template>

<script setup>
const { nome } = defineProps({
  nome: {
    type: String,
    default: '',
  },
});
</script>

<style scoped></style>
