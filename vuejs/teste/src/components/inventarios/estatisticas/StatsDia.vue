<script setup>
import { useRelatoriosStore } from "stores/relatorios";
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
const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando } = storeToRefs(relatoriosStore);
// const { estatisticasPorDia } = { relatoriosStore };
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
    // modo de edição ou visualização
    const id = +route.params.idInventario;
    await relatoriosStore.estatisticasPorDia(id);

    temDados.value = !!relatorio.value;
    chartData.datasets = relatorio.value.map((row) => ({
      label: row.usuario.nome,
      data: row.coleta.map((dia) => dia.qtde),
      borderColor: gerarCorAleatoria(),
      tension: 0.3,
    }));
    // chartData.datasets = [...graphData];
    if (relatorio.value.length > 0)
      if (relatorio.value[0].coleta.length > 0)
        relatorio.value[0].coleta.forEach((coletaDiaria) => {
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
