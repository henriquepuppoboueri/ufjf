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
const { carregando, dados, usuariosComColeta, diasComColeta } =
  storeToRefs(estatisticasStore);
const { buscarResumoDia } = estatisticasStore;
const labels = [];
const chartWidth = { type: Number, default: 400 };
const chartData = reactive({
  labels: labels,
  datasets: [],
});
const esconderUsuariosSemColeta = ref(false);
const esconderDiasSemColeta = ref(false);
const route = useRoute();
const temDados = ref(false);

watch(esconderUsuariosSemColeta, async (newV, old) => {
  await buscarResumoDia(+route.params.idInventario);
  montarGrafico(false, newV);
});

watch(esconderDiasSemColeta, async (newV, old) => {
  await buscarResumoDia(+route.params.idInventario);
  montarGrafico(newV, false);
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

async function montarGrafico(
  esconderDiasSemColeta = false,
  esconderUsuariosSemColeta = false
) {
  labels.splice(0, labels.length);
  let dadosRelatorio = ref(null);

  if (esconderUsuariosSemColeta) dadosRelatorio = usuariosComColeta;
  else if (esconderDiasSemColeta) dadosRelatorio = diasComColeta;
  else dadosRelatorio = dados;

  chartData.datasets = await dadosRelatorio.value.coleta.map((row) => ({
    label: row.usuario.nome,
    data: row.coleta.map((semana) => semana.qtde),
    borderColor: gerarCorAleatoria(),
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
    <Line :width="400" :height="300" :chart-data="chartData"></Line>
  </div>
  <q-toggle
    v-model="esconderUsuariosSemColeta"
    color="green"
    label="Esconder usuários sem coleta"
  />
  <q-toggle
    v-model="esconderDiasSemColeta"
    color="green"
    label="Esconder dias sem coleta"
  />
</template>
