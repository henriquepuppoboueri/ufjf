<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import QrEtiqueta from "src/components/utils/QrEtiqueta.vue";

const route = useRoute();
const prefix = route.query.prefix;
const firstSequence = +route.query.start;
const qtEtiquetas = +route.query.qtEtiquetas;
const ano = route.query.ano;
const etiquetaLargura = route.query.etiquetaLargura;
const etiquetaAltura = route.query.etiquetaAltura;
const etiquetaMargemY = route.query.etiquetaMargemY;
const etiquetaMargemX = route.query.etiquetaMargemX;
const nrCasasSequencia = route.query.nrCasasSequencia;

// const amountOfLabels = computed(() => {
//   return qtEtiquetas * 60;
// });
</script>

<template>
  <div class="container row justify-center">
    <div
      class="etiqueta"
      v-for="(label, index) in qtEtiquetas"
      :key="index"
      :style="{ height: `${etiquetaAltura}mm` }"
    >
      <qr-etiqueta
        :label-text="{
          prefix,
          sequence: firstSequence + index,
          ano,
        }"
        :page-options="{
          etiquetaLargura,
          etiquetaAltura,
          etiquetaMargemY,
          etiquetaMargemX,
          nrCasasSequencia,
        }"
      ></qr-etiqueta>
    </div>
  </div>
</template>

<style lang="sass">
.etiqueta
  // height: 80.12px
</style>
