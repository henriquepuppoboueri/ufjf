<script setup>
import { computed } from "vue";
import VueQrious from "vue-qrious";
import { useRoute } from "vue-router";

const props = defineProps({ labelText: Object });
const fullLabel = computed(() => {
  const paddedSequence = String(props.labelText.sequence).padStart(4, 0);
  return `${props.labelText.prefix}${paddedSequence}`;
});
</script>

<template>
  <div class="label-container row inline flex-center">
    <vue-qrious :value="`${fullLabel}`" level="M" :size="50"></vue-qrious>
    <span class="label-description text-center text-uppercase text-subtitle3">
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
  height: 104px
  width: 136px
  padding-top: 20px

  img
    height: 50px

.row
  // min-width: 150px


.label-description
  display: inline-block
  vertical-align: middle
  line-height: 0.8
  font-size: 9px
  letter-spacing: -2px
  writing-mode: vertical-lr
  text-orientation: upright
  word-wrap: break-word
  max-height: 40px
</style>
