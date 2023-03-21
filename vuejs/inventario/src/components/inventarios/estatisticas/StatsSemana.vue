<script setup>
import { useEstatisticasStore } from "stores/estatisticas";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { Bar, Line } from "vue-chartjs";
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
const chartWidth = { type: Number, default: 400 };
const chartData = reactive({
  labels: labels,
  datasets: [],
});

const route = useRoute();
const temDados = ref(false);

onMounted(async () => {
  if ("idInventario" in route.params) {
    const id = +route.params.idInventario;
    await buscarResumoSemana(id);

    temDados.value = !!dados.value.coleta.length;
    chartData.datasets = dados.value.coleta.map((row) => ({
      label: row.usuario.nome,
      data: row.coleta.map((semana) => semana.qtde),
      borderColor: gerarCorAleatoria(),
      tension: 0.3,
    }));
    if (temDados.value)
      if (dados.value.coleta.length > 0)
        for (let index = 0; index < dados.value.coleta.length; index++) {
          labels.push(`Semana # ${index + 1}`);
        }
  } else {
    return;
  }
});
</script>

<template>
  <div class="col q-gutter-y-md" v-if="temDados">
    <Line :width="chartWidth" :chart-data="chartData"></Line>
  </div>
</template>
