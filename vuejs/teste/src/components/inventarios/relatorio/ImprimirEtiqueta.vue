<script setup>
import { ref } from "vue";
import VueQrious from "vue-qrious";

const qrInput = ref("");
</script>

<template>
  <q-input v-model="qrInput" type="text" label="Label" />
  <vue-qrious :value="qrInput"></vue-qrious>
  <span>{{ qrInput }}</span>
</template>
