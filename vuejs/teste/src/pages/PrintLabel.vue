<script setup>
import { computed } from "vue";
import VueQrious from "vue-qrious";
import { useRoute } from "vue-router";

const route = useRoute();
const prefix = route.query.prefix;
const sequence = route.query.start.padStart(5, 0);

const qrInput = computed(() => {
  return `${prefix}${sequence}`;
});

qrInput.value = route.query.start.padStart(5, 0);
</script>

<template>
  <vue-qrious :value="qrInput" level="H"></vue-qrious>
  {{ qrInput }}
</template>
