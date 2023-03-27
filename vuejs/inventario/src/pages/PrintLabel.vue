<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import QrEtiqueta from "src/components/utils/QrEtiqueta.vue";

const route = useRoute();
const prefix = route.query.prefix;
const firstSequence = +route.query.start;
const pages = route.query.pages;
const ano = route.query.ano;
const containerPaddingTop = route.query.containerPaddingTop;
const containerMarginLeft = route.query.containerMarginLeft;
const containerWidth = route.query.containerWidth;
const imgHeight = route.query.imgHeight;

const amountOfLabels = computed(() => {
  return pages * 60;
});
</script>

<template>
  <div class="container">
    <div
      class="etiqueta"
      v-for="(label, index) in amountOfLabels"
      :key="index"
      :style="{
        marginLeft: containerMarginLeft + 'px',
      }"
    >
      <qr-etiqueta
        :label-text="{
          prefix,
          sequence: firstSequence + index,
          ano,
        }"
        :page-options="{
          containerPaddingTop,
          containerWidth,
          containerMarginLeft,
          imgHeight,
        }"
      ></qr-etiqueta>
    </div>
  </div>
</template>

<style lang="sass">
.container
  // padding-left: 15px
  // padding-top: 15px
  // margin: 0 auto

.etiqueta
  display: inline
  // height: 90px
  // height: 10px
</style>
