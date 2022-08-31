<script setup>
import { computed } from "vue";
import VueQrious from "vue-qrious";
import { useRoute } from "vue-router";
import QrEtiqueta from "src/components/utils/QrEtiqueta.vue";

const route = useRoute();
const prefix = route.query.prefix;
const firstSequence = +route.query.start;
const pages = route.query.pages;

const qrInput = computed(() => {
  return `${prefix}${firstSequence}`;
});

const amountOfLabels = computed(() => {
  return pages * 108;
});
</script>

<template>
  <div class="container">
    <div
      class="etiquetas"
      v-for="(label, index) in amountOfLabels"
      :key="index"
    >
      <qr-etiqueta
        :label-text="{ prefix, sequence: firstSequence + index }"
      ></qr-etiqueta>
    </div>
  </div>
</template>

<style lang="sass">



.etiquetas
  display: inline
</style>
