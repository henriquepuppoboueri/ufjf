<script setup>
import { storeToRefs } from "pinia";
import { useRelatoriosStore } from "src/stores/relatorios";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  diminuiTexto,
  registroPortugues,
  exportTable,
} from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";
import { useSetoresStore } from "src/stores/setores";
import { useDependenciasStore } from "src/stores/dependencias";

let idInventario = null;
const dependenciasStore = useDependenciasStore();
const setoresStore = useSetoresStore();
const { dependencias, dependencia } = storeToRefs(dependenciasStore);
const { setoresDependencias, setor } = storeToRefs(setoresStore);
const router = useRouter();
const itensSelecionados = ref([]);
const filtro = ref("");
const colunasItens = [
  {
    name: "patrimonio",
    align: "left",
    label: "PATRIMÔNIO",
    field: "patrimonio",
    sortable: true,
  },
  {
    name: "descricao",
    align: "left",
    label: "DESCRIÇÃO",
    field: "descricao",
    sortable: true,
  },
];
const route = useRoute();
const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

watch(itensSelecionados, (nv, ov) => {
  if (nv.length > 1) {
    itensSelecionados.value.shift();
  }
});

watch(setor, (nv, ov) => {
  if (nv) {
    dependenciasStore.buscarDependencias(nv.id);
    dependenciasStore.dependencia = [];
  }
});

onMounted(async () => {
  // const idInventario = route.params["idInventario"];
  idInventario = route.params["idInventario"];
  await setoresStore.buscarSetoresDependencias(idInventario);
  // await relatoriosStore.bensNaoEncontrados(idInventario);
});

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: "itemImportado",
      params: { idItem: itensSelecionados.value[0] },
    });
  }
}

function exportarDados() {
  exportTable(colunasItens, relatorio.value, "bens-sem-patrimonios");
}

async function filtrarSetorDep() {
  await relatoriosStore.bensNaoEncontrados(
    idInventario,
    setor.value.id,
    dependencia.value.id
  );
}

function limparFiltro() {
  setor.value = null;
  dependencia.value = null;
}
</script>

<template>
  <q-card square>
    <q-card-section class="q-gutter-sm">
      <q-select
        outlined
        v-model="setor"
        :options="setoresDependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Setor"
        dense
      />
      <q-select
        outlined
        v-model="dependencia"
        :options="dependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Dependência"
        dense
      />
      <q-btn
        :disable="carregando"
        dense
        size="0.7rem"
        icon="fa-solid fa-magnifying-glass"
        color="blue"
        label="Pesquisar"
        @click="filtrarSetorDep"
      />
      <q-btn
        :disable="carregando"
        dense
        size="0.7rem"
        color="green"
        label="Limpar filtro"
        @click="limparFiltro"
      />
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <!-- <q-card-section v-if="!carregando"> -->
      <q-table
        flat
        :loading="carregando"
        title="Bens não coletados"
        :rows="relatorio"
        :columns="colunasItens"
        row-key="id"
        separator="cell"
        :wrap-cells="true"
        :filter="filtro"
        :selected-rows-label="registroPortugues"
        :pagination="paginacaoOpcoes"
        :bordered="false"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:top-right>
          <q-input
            borderless
            dense
            filled
            debounce="300"
            v-model="filtro"
            placeholder="Filtrar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox
                left-label
                v-model="itensSelecionados"
                :val="props.row.id"
              />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="props.expand = !props.expand"
            >
              <span v-html="diminuiTexto(col.value)"></span>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <span v-html="props.row.descricao"></span>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions>
      <q-btn
        v-if="qtItensSelec && qtItensSelec === 1"
        dense
        color="orange"
        class="text-white"
        label="Visualizar"
        @click="verItem"
      />
      <q-btn
        v-if="!carregando"
        dense
        color="red"
        class="text-white"
        label="Exportar"
        @click="exportarDados"
      />
    </q-card-actions>
  </q-card>
</template>
