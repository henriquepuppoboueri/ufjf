<script setup>
// const props = defineProps(["modelValue", "evento", "titulo", "mensagem"]);
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  evento: { type: String, default: "" },
  titulo: { type: String, default: "" },
  mensagem: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "resposta"]);

function enviarResposta(resposta) {
  emit("resposta", { evento: props.evento, resposta });
}
</script>

<template>
  <!-- <q-dialog persistent :model-value="modelValue" > -->
  <q-dialog persistent :model-value="true">
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
          @click="enviarResposta(false)"
        />
        <q-btn
          v-close-popup
          dense
          color="green"
          label="Sim"
          @click="enviarResposta(true)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
