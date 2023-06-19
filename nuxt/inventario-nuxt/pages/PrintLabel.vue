<script setup>
import QrEtiqueta from '/components/utils/QrEtiqueta.vue';

const route = useRoute();
const prefix = route.query.prefix;
const firstSequence = +route.query.start;
const qtEtiquetas = +route.query.qtEtiquetas;
const ano = route.query.ano;
const etiquetaAltura = route.query.etiquetaAltura;
const etiquetaMargemY = route.query.etiquetaMargemY;
const etiquetaMargemX = route.query.etiquetaMargemX;
const paginaMargemTop = route.query.paginaMargemTop;
// const etiquetaLargura = route.query.etiquetaLargura;
// const nrCasasSequencia = route.query.nrCasasSequencia;
const mostrarBorda = route.query.mostrarBorda;
const etiquetasPorPagina = +route.query.etiquetasPorPagina;
const nrPaginas = Math.round(
  +route.query.qtEtiquetas / +route.query.etiquetasPorPagina
);
</script>

<template>
  <div v-for="(pagina, indexPagina) in nrPaginas" :key="pagina">
    <div
      class="container row justify-center"
      :style="{ marginTop: `${paginaMargemTop}mm` }"
    >
      <div
        v-for="(label, index) in etiquetasPorPagina"
        :key="index + indexPagina * etiquetasPorPagina"
        class="etiqueta flex"
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
            sequence:
              firstSequence + (index + indexPagina * etiquetasPorPagina),
            ano,
          }"
          :page-options="{
            ...route.query,
          }"
        ></qr-etiqueta>
      </div>
    </div>
    <div :style="{ breakBefore: 'page' }"></div>
  </div>

  <!-- <div :style="{ breakBefore: 'page' }">1st</div>
  <div :style="{ breakBefore: 'page' }">2nd</div> -->
</template>

<style lang="sass"></style>
