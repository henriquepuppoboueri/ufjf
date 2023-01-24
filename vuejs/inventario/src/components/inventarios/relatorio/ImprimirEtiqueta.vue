<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { format } from "quasar";

const { pad } = format;

const router = useRouter();
const prefix = ref("");
const start = ref();
const pages = ref();
const ano = ref();

function onGerarEtiquetas() {
  router.push({
    name: "printLabel",
    query: {
      prefix: prefix.value,
      start: start.value,
      pages: pages.value,
      ano: ano.value,
    },
  });
}
</script>

<template>
  <div class="q-gutter-md">
    <q-card class="my-card" flat>
      <q-card-section>
        <q-input v-model="prefix" type="text" label="Prefixo" />
        <q-input
          v-model="start"
          type="text"
          label="Primeira sequência"
          mask="####"
          fill-mask="0000"
          reverse-fill-mask
        />
        <q-input v-model="ano" type="text" label="Unidade - Ano" />
        <q-input v-model="pages" type="text" label="Nº de páginas" />
      </q-card-section>
      <q-card-section>
        <q-btn
          color="primary"
          label="Gerar etiquetas"
          @click="onGerarEtiquetas"
        />
      </q-card-section>
    </q-card>
  </div>
</template>
