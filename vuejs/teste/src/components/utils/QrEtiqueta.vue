<script setup>
import { computed } from "vue";
import VueQrious from "vue-qrious";
import { useRoute } from "vue-router";

const props = defineProps({ labelText: Object });
const fullLabel = computed(() => {
  const paddedSequence = String(props.labelText.sequence).padStart(5, 0);
  return `${props.labelText.prefix}${paddedSequence}`;
});
</script>

<template>
  <div class="row inline q-ma-md">
    <vue-qrious :value="`${labelText}`" level="M" :size="26"></vue-qrious>
    <div class="label-container">
      <span class="q-ml-xs label-description text-bold">
        {{ fullLabel }}
      </span>
    </div>
  </div>
</template>

<style lang="sass">
.row
  // min-width: 150px

.label-container
  text-align: center
  margin: 0 auto


.label-description
  display: inline-block
  vertical-align: middle
  line-height: normal
</style>
