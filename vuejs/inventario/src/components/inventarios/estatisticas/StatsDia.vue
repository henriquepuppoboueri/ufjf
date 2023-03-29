<script setup>
import { onMounted, reactive, ref } from "vue";
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
import { useEstatisticasStore } from "stores/estatisticas";

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
const { buscarResumoDia } = estatisticasStore;
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
    await buscarResumoDia(id);

    temDados.value = !!dados.value.coleta.length;
    chartData.datasets = dados.value.coleta.map((row) => ({
      label: row.usuario.nome,
      data: row.coleta.map((semana) => semana.qtde),
      borderColor: gerarCorAleatoria(),
      tension: 0.3,
    }));
    if (temDados.value)
      if (dados.value.coleta.length > 0)
        dados.value.coleta[0].coleta.forEach((coletaDiaria) => {
          labels.push(coletaDiaria.data);
        });
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
