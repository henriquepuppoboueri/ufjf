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
const containerPaddingTop = ref("49");
const containerMarginLeft = ref("0");
const containerWidth = ref("136");
const imgHeight = ref("42");

function onGerarEtiquetas() {
  router.push({
    name: "printLabel",
    query: {
      prefix: prefix.value,
      start: start.value,
      pages: pages.value,
      ano: ano.value,
      containerPaddingTop: containerPaddingTop.value,
      containerMarginLeft: containerMarginLeft.value,
      containerWidth: containerWidth.value,
      imgHeight: imgHeight.value,
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
          mask="#######"
          fill-mask="0000000"
          reverse-fill-mask
        />
        <q-input v-model="ano" type="text" label="Unidade - Ano" />
        <q-input v-model="pages" type="text" label="Nº de páginas" />
      </q-card-section>
      <q-card-section>
        <q-expansion-item
          switch-toggle-side
          class="text-grey-8"
          expand-separator
          icon="fa-solid fa-gear"
          label="Opções avançadas"
        >
          <q-card>
            <q-card-section>
              <q-input
                v-model="containerPaddingTop"
                type="text"
                label="Padding Top (padrão: 49px)"
              />
              <!-- <q-input
                v-model="containerPaddingLeft"
                type="text"
                label="Padding Left (padrão: 0px)"
              /> -->
              <q-input
                v-model="containerWidth"
                type="text"
                label="Width (padrão: 136px)"
              />
              <q-input
                v-model="containerMarginLeft"
                type="text"
                label="Margin Left (padrão: 0px)"
              />
              <q-input
                v-model="imgHeight"
                type="text"
                label="Image Height (padrão: 42px)"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
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
