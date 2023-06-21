<template>
  <div class="q-px-md">
    <div class="row justify-between">
      <h3 class="q-my-md">Estatísticas</h3>
      <div v-if="!carregando" class="column q-pa-sm items-end">
        <span v-if="dados" class="text-grey-8"
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
  ultimaBusca.value.recalcular();
};
</script>
