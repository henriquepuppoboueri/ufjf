<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
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
const labels = [];
const chartWidth = { type: Number, default: 400 };
const chartData = reactive({
  labels: labels,
  datasets: [],
});

const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);

function gerarCorAleatoria() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
}

onMounted(() => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;

    api
      .get(`v1/restrito/inventario/usuario/qtdecoletadia/${id}`)
      .then((res) => {
        resumo.value = res.data;
        temDados.value = !!resumo.value;
        const graphData = res.data.map((row) => ({
          label: row.usuario.nome,
          data: row.coleta.map((dia) => dia.qtde),
          borderColor: gerarCorAleatoria(),
          tension: 0.3,
        }));
        chartData.datasets = [...graphData];
        if (res.data.length > 0)
          if (res.data[0].coleta.length > 0)
            res.data[0].coleta.forEach((coletaDiaria) => {
              labels.push(coletaDiaria.data);
            });
      });
  } else {
    usuario;
    return;
  }
});
</script>

<template>
  <div class="col q-gutter-y-md" v-if="temDados">
    <Line :width="chartWidth" :chart-data="chartData"></Line>
  </div>
</template>
