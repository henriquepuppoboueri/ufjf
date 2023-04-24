<script setup>
import { computed } from "vue";

import VueQrious from "vue-qrious";

const props = defineProps({ labelText: Object, pageOptions: Object });
const fullLabel = computed(() => {
  const paddedSequence = String(props.labelText.sequence).padStart(
    props.pageOptions.nrCasasSequencia,
    0
  );
  return `${props.labelText.prefix}${paddedSequence}`;
});
</script>

<template>
  <div
    class="label-container text-bold row inline flex flex-center"
    :style="{
      maxHeight: pageOptions.etiquetaAltura + 'mm',
      width: pageOptions.etiquetaLargura + 'mm',
      paddingTop: pageOptions.containerPaddingTop + 'mm',
    }"
  >
    <vue-qrious
      :value="`${fullLabel}`"
      level="M"
      :style="{
        height: pageOptions.etiquetaAltura * 0.8 + 'mm',
      }"
    ></vue-qrious>
    <span class="label-description text-center text-uppercase text-subtitle3">
      {{ fullLabel }}
      <br />
      {{ props.labelText.ano }}
    </span>
  </div>
</template>

<style lang="sass">

.label-description
  display: inline-block
  vertical-align: middle
  line-height: 0.8
  font-size: 8px
  letter-spacing: -2px
  writing-mode: vertical-lr
  text-orientation: upright
  word-wrap: break-word
</style>
