<script setup>
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
import ColorHash from "color-hash";
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
const { carregando, dados, usuariosComColetaDia, diasComColeta } =
  storeToRefs(estatisticasStore);
const { buscarResumoDia } = estatisticasStore;
const labels = [];
const chartWidth = { type: Number, default: 400 };
const chartData = reactive({
  labels: labels,
  datasets: [],
});
const esconderUsuariosDiasSemColeta = ref(false);
const route = useRoute();
const temDados = ref(false);

watch(esconderUsuariosDiasSemColeta, async (newV, old) => {
  await buscarResumoDia(+route.params.idInventario);
  montarGrafico(newV);
});

onMounted(async () => {
  if ("idInventario" in route.params) {
    const id = +route.params.idInventario;
    await buscarResumoDia(id);
    // await montarGrafico();
    temDados.value = !!dados.value.coleta.length;
    if (temDados.value)
      if (dados.value.coleta.length > 0) {
        montarGrafico();
      }
  } else {
    return;
  }
});

async function montarGrafico(esconderUsuariosDiasSemColeta = false) {
  labels.splice(0, labels.length);
  let dadosRelatorio = ref(null);

  if (esconderUsuariosDiasSemColeta)
    dadosRelatorio.value = usuariosComColetaDia;
  else dadosRelatorio.value = dados;

  chartData.datasets = await dadosRelatorio.value.coleta.map((row) => ({
    label: row.usuario.nome,
    data: row.coleta.map((semana) => semana.qtde),
    borderColor: new ColorHash().hex(row.usuario.nome),
    tension: 0.3,
  }));
  for (
    let index = 0;
    index < dadosRelatorio.value.coleta[0].coleta.length;
    index++
  ) {
    labels.push(dadosRelatorio.value.coleta[0].coleta[index].data);
  }
}
</script>

<template>
  <div class="col q-gutter-y-md" v-if="temDados">
    <Line :width="400" :height="150" :chart-data="chartData"></Line>
  </div>
  <q-toggle
    v-model="esconderUsuariosDiasSemColeta"
    color="green"
    label="Ocultar usuários e dias sem coleta"
  />
</template>
