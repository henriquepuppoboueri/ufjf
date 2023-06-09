<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Line } from 'vue-chartjs';
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
} from 'chart.js';
import { storeToRefs } from 'pinia';
import ColorHash from 'color-hash';

definePageMeta({
  name: 'resumo-semanal',
});

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
const {
  carregando,
  dados,
  somenteSemanasUsuariosComColeta,
  somenteSemanasUsuariosComColetasAcumuladas,
} = storeToRefs(estatisticasStore);
const { buscarResumoSemana } = estatisticasStore;
const width = ref(400);
const height = ref();
const route = useRoute();
const temDados = ref(false);
const acumularPeriodos = ref(false);
const chartDataSource = computed(() => {
  return acumularPeriodos.value
    ? somenteSemanasUsuariosComColetasAcumuladas.value
    : somenteSemanasUsuariosComColeta.value;
});

function generateChart({ acumulado = false } = {}) {
  const chart = {
    labels: [],
    datasets: [],
  };
  chart.labels.splice(0, chart.labels.length);
  chart.datasets = chartDataSource.value.coleta.map((row) => ({
    label: row.usuario.nome,
    data: row.coleta.map((semana) => semana.qtde),
    borderColor: new ColorHash().hex(row.usuario.nome),
    tension: 0.3,
  }));
  chartDataSource.value.coleta[0].coleta.forEach((semana) => {
    chart.labels.push(`${semana.semana}-${semana.ano}`);
  });
  return chart;
}

onMounted(async () => {
  if ('idInventario' in route.params) {
    const id = +route.params.idInventario;
    await buscarResumoSemana(id);
    temDados.value = !!dados.value.coleta.length;
    if (temDados.value)
      if (dados.value.coleta.length > 0) {
        generateChart();
      }
  } else {
    return;
  }
});
</script>

<template>
  <div v-if="temDados" class="col q-gutter-y-md">
    <Line :width="width" height="150" :data="generateChart()" />
    <q-toggle
      v-model="acumularPeriodos"
      color="green"
      label="Acumular períodos"
    />
    <p class="text-italic text-grey-8 text-caption">
      Semanas e usuários sem coletas não são exibidos.
    </p>
  </div>
</template>
