<script setup>
import { computed } from "vue";

import VueQrious from "vue-qrious";

const props = defineProps({ labelText: Object, pageOptions: Object });
const fullLabel = computed(() => {
  const paddedSequence = String(props.labelText.sequence).padStart(7, 0);
  return `${props.labelText.prefix}${paddedSequence}`;
});
</script>

<template>
  <div
    class="label-container text-bold row inline flex-center"
    :style="{
      width: pageOptions.containerWidth + 'px',
      paddingTop: pageOptions.containerPaddingTop + 'px',
      marginLeft: pageOptions.containerMarginLeft + 'px',
    }"
  >
    <vue-qrious
      :value="`${fullLabel}`"
      level="M"
      :size="+pageOptions.imgHeight * 1.5"
      :style="{ height: pageOptions.imgHeight + 'px' }"
    ></vue-qrious>
    <span
      class="label-description text-center text-uppercase text-subtitle3"
      :style="{ maxHeight: pageOptions.imgHeight + 'px' }"
    >
      {{ fullLabel }}
      <br />
      {{ props.labelText.ano }}
    </span>
  </div>
</template>

<style lang="sass">
.label-container
  // margin-right: 25px
  // margin-bottom: 40px
  // height: 85px
  // width: 136px
  // padding-top:49px

  img
    // height: 42px

.row
  // min-width: 150px


.label-description
  display: inline-block
  vertical-align: middle
  line-height: 0.8
  font-size: 8px
  letter-spacing: -2px
  writing-mode: vertical-lr
  text-orientation: upright
  word-wrap: break-word
  // max-height: 42px
</style>
