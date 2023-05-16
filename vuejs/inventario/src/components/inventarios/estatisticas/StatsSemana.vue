<script setup>
import { useEstatisticasStore } from "stores/estatisticas";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { storeToRefs } from "pinia";
import { gerarCorAleatoria } from "src/helper/functions";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
const estatisticasStore = useEstatisticasStore();
const { carregando, dados } = storeToRefs(estatisticasStore);
const { buscarResumoSemana } = estatisticasStore;
const labels = [];
const chartData = reactive({
  labels: labels,
  datasets: [],
});
const width = ref(400);
const height = ref(150);
const route = useRoute();
const temDados = ref(false);
const esconderSemColeta = ref(false);

watch(esconderSemColeta, async (newV, old) => {
  await buscarResumoSemana(+route.params.idInventario, newV);
  montarGrafico();
});

async function montarGrafico(semColeta) {
  labels.splice(0, labels.length);
  chartData.datasets = dados.value.coleta.map((row) => ({
    label: row.usuario.nome,
    data: row.coleta.map((semana) => semana.qtde),
    borderColor: gerarCorAleatoria(),
    tension: 0.3,
  }));
  for (let index = 0; index < dados.value.coleta[0].coleta.length; index++) {
    labels.push(`Semana #${index + 1}`);
  }
}

onMounted(async () => {
  if ("idInventario" in route.params) {
    const id = +route.params.idInventario;
    await buscarResumoSemana(id);
    temDados.value = !!dados.value.coleta.length;
    if (temDados.value)
      if (dados.value.coleta.length > 0) {
        montarGrafico();
      }
  } else {
    return;
  }
});
</script>

<template>
  <div class="col q-gutter-y-md" v-if="temDados">
    <Line :width="width" :height="height" :chart-data="chartData" />
    <q-toggle
      v-model="esconderSemColeta"
      color="green"
      label="Ocultar usuários sem coleta"
    />
  </div>
</template>
