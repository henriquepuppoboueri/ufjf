<script setup>
import { useEstatisticasStore } from "stores/estatisticas";
import { onMounted, reactive, ref, watch, computed, watchEffect } from "vue";
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
import ColorHash from "color-hash";

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
const labels = [];
const chartData = reactive({
  labels: labels,
  datasets: [],
});
const width = ref(400);
const height = ref(150);
const route = useRoute();
const temDados = ref(false);
const acumularPeriodos = ref(false);
const chartDataSource = computed(() => {
  return acumularPeriodos.value
    ? somenteSemanasUsuariosComColetasAcumuladas.value
    : somenteSemanasUsuariosComColeta.value;
});
const chart = ref(null);

watchEffect(() => {
  if (chart.value && chart.value.chart) {
    console.log(chart.value.chart);
  }
});

function montarGrafico({ semColeta, acumulado = false } = {}) {
  labels.splice(0, labels.length);
  chartData.datasets = chartDataSource.value.coleta.map((row) => ({
    label: row.usuario.nome,
    data: row.coleta.map((semana) => semana.qtde),
    borderColor: new ColorHash().hex(row.usuario.nome),
    tension: 0.3,
  }));
  chartDataSource.value.coleta[0].coleta.forEach((semana) => {
    labels.push(`${semana.semana}-${semana.ano}`);
  });
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
    <Line ref="chart" :width="width" :height="height" :data="chartData" />
    <!-- <q-toggle
      v-model="esconderSemColeta"
      color="green"
      label="Ocultar usuários sem coleta"
    /> -->
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
