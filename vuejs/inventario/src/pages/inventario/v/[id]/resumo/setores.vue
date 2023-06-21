<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useEstatisticasStore } from "stores/estatisticas";
import { storeToRefs } from "pinia";

const estatisticasStore = useEstatisticasStore();
const { carregando, dados } = storeToRefs(estatisticasStore);
const { buscarTotaisSetores } = estatisticasStore;
const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);
const colunas = [
  {
    name: "setor",
    align: "left",
    label: "DEPENDÊNCIA",
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

onMounted(async () => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;

    const response = await buscarTotaisSetores(id);
    resumo.value = dados.value;
    temDados.value = !!resumo.value.qtde;
  } else {
    return;
  }
});

function corBarra(percValor) {
  if (percValor === 100) return "green";
  if (percValor > 75) return "light-green";
  if (percValor > 50) return "yellow";
  if (percValor > 25) return "orange";
  return "red";
}
</script>

<template>
  <div v-if="temDados" class="col q-gutter-y-md">
    <div v-for="item in resumo.setores" :key="item.setor.id">
      <q-table
        flat
        hide-pagination
        square
        :bordered="false"
        :title="item.setor.nome"
        :rows="item.dependencias"
        :columns="colunas"
        row-key="data"
        :rows-per-page-options="[0]"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <!-- {{
                col.name === "percConcluido"
                  ? `${parseFloat(col.value).toFixed(2)}%`
                  : col.value
              }} -->
              {{ col.name === "percConcluido" ? `` : col.value }}
              <q-linear-progress
                v-if="col.name === 'percConcluido'"
                stripe
                rounded
                size="25px"
                :value="col.value / 100"
                :color="corBarra(col.value)"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="black"
                    :label="`${parseFloat(col.value).toFixed(2)}%`"
                  />
                </div>
              </q-linear-progress>
            </q-td>
          </q-tr>
        </template>
        <template #bottom-row>
          <q-tr>
            <q-td class="text-uppercase text-bold text-left">total</q-td>
            <q-td class="text-bold text-right">{{ item.qtde }}</q-td>
            <q-td class="text-bold text-right">{{ item.qtdeColetada }}</q-td>
            <q-td class="text-bold text-right">
              <q-linear-progress
                stripe
                rounded
                size="25px"
                :value="item.percentualConcluido / 100"
                :color="corBarra(item.percentualConcluido)"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="black"
                    :label="`${parseFloat(item.percentualConcluido).toFixed(
                      2
                    )}%`"
                  />
                </div>
              </q-linear-progress>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator class="no-margin" spaced />
    </div>
  </div>
  <div v-if="!temDados">
    <p v-if="!carregando">Nada a exibir.</p>
    <q-spinner-dots v-if="carregando" color="primary" size="2em" />
  </div>
</template>
