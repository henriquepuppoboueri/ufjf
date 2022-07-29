<script setup>
import { onMounted, onUnmounted, onUpdated } from "vue";

const props = defineProps(["modelValue", "titulo", "mensagem"]);
const emits = defineEmits("update:modelValue", "resposta");

onUnmounted(() => {
  console.log("unmounted");
  emits("resposta", true);
});
</script>

<template>
  <q-dialog persistent :model-value="modelValue">
    <q-card class="q-pa-sm">
      <q-card-section class="text-h6 text-center text-bold">
        {{ titulo }}
      </q-card-section>
      <q-card-section>
        <p class="text-center text-subtitle">
          {{ mensagem }}
        </p>
      </q-card-section>
      <q-card-actions class="flex-center q-gutter-md">
        <q-btn
          v-close-popup
          dense
          color="red"
          label="Não"
          @click="emits('resposta', false)"
        />
        <q-btn
          v-close-popup
          dense
          color="green"
          label="Sim"
          @click="emits('resposta', true)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
