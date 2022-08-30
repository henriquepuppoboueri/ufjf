<script setup>
import { computed } from "vue";
import VueQrious from "vue-qrious";
import { useRoute } from "vue-router";

const props = defineProps({ labelText: Object });
</script>

<template>
  <div class="row inline q-ma-md">
    <vue-qrious :value="`${label}`" level="H" :size="70"></vue-qrious>
    <span class="input text-bold">
      {{ labelText }}
    </span>
  </div>
</template>
