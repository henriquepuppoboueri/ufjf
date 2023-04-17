<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { format } from "quasar";

const { pad } = format;

const router = useRouter();
const prefix = ref("");
const nrCasasSequencia = ref(7);
const start = ref(1);
const qtEtiquetas = ref(10);
const ano = ref(new Date().getFullYear());
const etiquetaLargura = ref(38.2);
const etiquetaAltura = ref(21.2);
const etiquetaMargemY = ref(0);
const etiquetaMargemX = ref(0);

const nrCasasZeros = computed(() => {
  return geraStringConcat("0");
});

const nrCasasCerquilha = computed(() => {
  return geraStringConcat("#");
});

const geraStringConcat = (val) =>
  new Array(+nrCasasSequencia.value)
    .fill(val, 0, nrCasasSequencia.value)
    .join("");

function onGerarEtiquetas() {
  router.push({
    name: "printLabel",
    query: {
      prefix: prefix.value,
      start: start.value,
      qtEtiquetas: qtEtiquetas.value,
      ano: ano.value,
      nrCasasSequencia: nrCasasSequencia.value,
      etiquetaLargura: etiquetaLargura.value,
      etiquetaAltura: etiquetaAltura.value,
      etiquetaMargemY: etiquetaMargemY.value,
      etiquetaMargemX: etiquetaMargemX.value,
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
          v-model="nrCasasSequencia"
          type="number"
          label="Número de casas"
        />
        <q-input
          v-model="start"
          type="text"
          label="Primeira sequência"
          :mask="nrCasasCerquilha"
          :fill-mask="nrCasasZeros"
          reverse-fill-mask
        />
        <q-input v-model="ano" type="text" label="Unidade - Ano" />
        <q-input
          v-model="qtEtiquetas"
          type="text"
          label="Quantidade de etiquetas"
        />
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
                v-model="etiquetaLargura"
                type="number"
                label="Altura da etiqueta (mm)"
                step="0.1"
              />
              <!-- <q-input
                v-model="containerPaddingLeft"
                type="text"
                label="Padding Left (padrão: 0px)"
              /> -->
              <q-input
                v-model="etiquetaAltura"
                type="number"
                label="Largura da etiqueta (mm)"
                step="0.1"
              />
              <q-input
                v-model="etiquetaMargemX"
                type="number"
                label="Distância no eixo horizontal (mm)"
                step="0.1"
              />
              <q-input
                v-model="etiquetaMargemY"
                type="number"
                label="Distância no eixo vertical (mm)"
                step="0.1"
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
