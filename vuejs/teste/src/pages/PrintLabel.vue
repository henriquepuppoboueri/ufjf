<script setup>
import { computed } from "vue";
import VueQrious from "vue-qrious";
import { useRoute } from "vue-router";
import QrEtiqueta from "src/components/utils/QrEtiqueta.vue";

const route = useRoute();
const prefix = route.query.prefix;
const firstSequence = +route.query.start;
const pages = route.query.pages;
const ano = route.query.ano;

const amountOfLabels = computed(() => {
  return pages * 60;
});
console.log(ano);
</script>

<template>
  <div class="container">
    <div
      class="etiqueta flex-center"
      v-for="(label, index) in amountOfLabels"
      :key="index"
    >
      <qr-etiqueta
        :label-text="{
          prefix,
          sequence: firstSequence + index,
          ano,
        }"
      ></qr-etiqueta>
    </div>
  </div>
</template>

<style lang="sass">
.container
  // padding-left: 15px
  // padding-top: 15px
  margin: 0 auto

.etiqueta
  display: inline
  // height: 10px
</style>
