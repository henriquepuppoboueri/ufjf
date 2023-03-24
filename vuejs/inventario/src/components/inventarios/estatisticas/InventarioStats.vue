<template>
  <div class="q-px-md">
    <div class="row justify-between">
      <h3 class="q-my-md">Estatísticas</h3>
      <div v-if="!carregando" class="column q-pa-sm items-end">
        <span class="text-grey-8" v-if="dados"
          >Data dos dados: {{ dados.data }} - solicitado por:
          {{ dados.solicitadoPor }}
        </span>
        <q-btn
          dense
          flat
          class="q-pa-none"
          color="green"
          icon="refresh"
          label="Atualizar dados"
          @click="refreshReportData"
        />
      </div>
      <div v-if="carregando" class="self-center">
        <q-spinner-gears color="primary" size="2em" />
      </div>
    </div>
    <router-view></router-view>
    <!-- <q-separator></q-separator>
    <span class="text-overline" v-if="dados"
      >Data dos dados: {{ dados.data }} - solicitado por:
      {{ dados.solicitadoPor }}
    </span> -->
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEstatisticasStore } from "stores/estatisticas";

const estatisticasStore = useEstatisticasStore();
const { dados, carregando, ultimaBusca } = storeToRefs(estatisticasStore);

onMounted(() => {});

const refreshReportData = () => {
  // console.log(ultimaBusca.value.funcao());
  ultimaBusca.value.recalcular();
};
</script>
