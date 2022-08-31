<script setup>
import { ref } from "vue";
import VueQrious from "vue-qrious";
import { useRouter } from "vue-router";

const router = useRouter();
const prefix = ref("");
const start = ref();
const pages = ref();

function onGerarEtiquetas() {
  router.push({
    name: "printLabel",
    query: { prefix: prefix.value, start: start.value, pages: pages.value },
  });
}
</script>

<template>
  <div class="q-gutter-md">
    <q-card class="my-card" flat>
      <q-card-section>
        <q-input v-model="prefix" type="text" label="Prefixo" />
        <q-input v-model="start" type="text" label="Primeira sequência" />
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
