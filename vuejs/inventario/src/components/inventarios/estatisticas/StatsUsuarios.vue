<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useEstatisticasStore } from "stores/estatisticas";
import { storeToRefs } from "pinia";

const estatisticasStore = useEstatisticasStore();
const { carregando, dados } = storeToRefs(estatisticasStore);
const { buscarResumoUsuarios } = estatisticasStore;
const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);
const usuariosDados = ref([]);
const colunas = [
  {
    name: "data",
    align: "left",
    label: "DATA",
    field: "data",
    sortable: true,
  },
  {
    name: "qtde",
    align: "left",
    label: "QUANTIDADE",
    field: "qtde",
    sortable: true,
  },
];

onMounted(async () => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;
    await buscarResumoUsuarios(id);
    resumo.value = await dados.value.coleta;
    temDados.value = !!dados.value.coleta.length;
  } else return;
});

function somaQtde(item) {
  if (item.coleta === null || item.coleta === undefined) return 0;
  return item.coleta
    .map((i) => {
      return i.qtde;
    })
    .reduce((pv, cv) => pv + cv);
}

function mostrarDadosUsuario(idUsuario) {
  return usuariosDados.value.includes(idUsuario);
}

function addDelMostrarUsuario(idUsuario) {
  if (usuariosDados.value.includes(idUsuario)) {
    const index = usuariosDados.value.indexOf(idUsuario);
    usuariosDados.value.splice(index, 1);
  } else {
    usuariosDados.value.push(idUsuario);
  }
}
</script>

<template>
  <div class="col q-gutter-y-md" v-if="temDados">
    <div v-for="item in resumo" :key="item.usuario">
      <q-table
        flat
        square
        :bordered="false"
        :title="item.usuario.nome"
        :rows="item.coleta !== null ? item.coleta : [{ data: '-', qtde: '-' }]"
        :columns="colunas"
        :rows-per-page-options="[5]"
        row-key="data"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" v-if="mostrarDadosUsuario(item.usuario.id)">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom-row="props">
          <q-tr :props="props" @click="addDelMostrarUsuario(item.usuario.id)">
            <q-td class="text-uppercase text-bold text-left">total</q-td>

            <q-td class="text-bold text-left">
              {{ somaQtde(item) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator class="no-margin" spaced />
    </div>
  </div>
  <div v-if="!temDados">
    <p>Nada a exibir.</p>
  </div>
</template>
