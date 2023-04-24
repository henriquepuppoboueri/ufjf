<script setup>
import { useRoute } from "vue-router";

import QrEtiqueta from "src/components/utils/QrEtiqueta.vue";

const route = useRoute();
const prefix = route.query.prefix;
const firstSequence = +route.query.start;
const qtEtiquetas = +route.query.qtEtiquetas;
const ano = route.query.ano;
const etiquetaAltura = route.query.etiquetaAltura;
const etiquetaMargemY = route.query.etiquetaMargemY;
const etiquetaMargemX = route.query.etiquetaMargemX;
// const etiquetaLargura = route.query.etiquetaLargura;
// const nrCasasSequencia = route.query.nrCasasSequencia;
const mostrarBorda = route.query.mostrarBorda;
</script>

<template>
  <div class="container row justify-center">
    <div
      class="etiqueta flex"
      v-for="(label, index) in qtEtiquetas"
      :key="index"
      :style="{
        minHeight: `${etiquetaAltura}mm`,
        border: mostrarBorda === '1' ? 'solid 0.1mm black' : 'none',
        borderRadius: '2mm',
        marginLeft: etiquetaMargemX + 'mm',
        marginRight: etiquetaMargemX + 'mm',
        marginTop: etiquetaMargemY + 'mm',
        marginBottom: etiquetaMargemY + 'mm',
      }"
    >
      <qr-etiqueta
        :label-text="{
          prefix,
          sequence: firstSequence + index,
          ano,
        }"
        :page-options="{
          ...route.query,
        }"
      ></qr-etiqueta>
    </div>
  </div>
  <!-- <div :style="{ breakBefore: 'page' }">1st</div>
  <div :style="{ breakBefore: 'page' }">2nd</div> -->
</template>

<style lang="sass">
.etiqueta
  // height: 80.12px

.q-gutter-y-md .etiqueta
  // margin-top: 16px
</style>
