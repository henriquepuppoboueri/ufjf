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
  datasets: [
    // {
    //   label: "My First Dataset",
    //   data: [65, 59, 80, 81, 56, 55],
    //   fill: false,
    //   borderColor: "rgb(75, 192, 192)",
    //   tension: 0.1,
    // },
    // {
    //   label: "My Second Dataset",
    //   data: [68, 50, 180, 81, 50, 15],
    //   fill: false,
    //   borderColor: "rgb(75, 192, 192)",
    //   tension: 0.1,
    // },
  ],
});

const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);
const colunas = [
  {
    name: "setor",
    align: "left",
    label: "SETOR",
    field: "nomeDependencia",
    sortable: true,
  },
  {
    name: "importados",
    align: "right",
    label: "ITENS IMPORTADOS",
    field: "qtde",
    sortable: true,
  },
  {
    name: "importados",
    align: "right",
    label: "ITENS COLETADOS",
    field: "qtdeColetada",
    sortable: true,
  },
  {
    name: "percConcluido",
    align: "right",
    label: "(%) CONCLUÍDO",
    field: "percentualConcluido",
    sortable: true,
  },
  // {
  //   name: "percConcGraph",
  //   align: "right",
  //   label: "(%) CONCLUÍDO",
  //   field: "percConcGraph",
  //   sortable: true,
  // },
];

function gerarCorAleatoria() {
  //"rgb(75, 192, 192)"
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
}

onMounted(() => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;

    api
      .get(`v1/restrito/inventario/usuario/qtdecoletasemana/${id}`)
      .then((res) => {
        resumo.value = res.data;
        temDados.value = !!resumo.value;
        // const printar = res.data;
        const graphData = res.data.map((item) => {
          return {
            label: item.usuario.nome,
            data: item.coleta.map((itemColetado) => itemColetado.qtde),
            borderColor: gerarCorAleatoria(),
            tension: 0.3,
          };
        });
        chartData.datasets = [...graphData];
        if (graphData.length > 0) {
          if (graphData[0].data.length > 0) {
            for (let index = 0; index < graphData[0].data.length; index++) {
              labels.push(`Semana # ${index + 1}`);
            }
          }
        }
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
