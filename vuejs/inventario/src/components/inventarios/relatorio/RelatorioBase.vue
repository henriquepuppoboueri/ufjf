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
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
let idInventario = null;
const dependenciasStore = useDependenciasStore();
const { dependencias, dependencia } = storeToRefs(dependenciasStore);
const setoresStore = useSetoresStore();
const { setoresDependencias, setor } = storeToRefs(setoresStore);
const router = useRouter();
const itensSelecionados = ref([]);
const filtro = ref("");
const nomeRelatorio = ref("");
const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);

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
  {
    name: "setorEncontrado",
    align: "left",
    label: "SETOR ENCONTRADO",
    field: "setorEncontrado",
    sortable: true,
  },
  {
    name: "setorPrevisto",
    align: "left",
    label: "SETOR PREVISTO",
    field: "setorPrevisto",
    sortable: true,
  },
  {
    name: "dependenciaEncontrada",
    align: "left",
    label: "DEP. ENCONTRADA",
    field: "dependenciaEncontrada",
    sortable: true,
  },
  {
    name: "dependenciaPrevista",
    align: "left",
    label: "DEP. PREVISTA",
    field: "dependenciaPrevista",
    sortable: true,
  },
  {
    name: "localizacao",
    align: "left",
    label: "LOCALIZAÇÃO",
    field: "localizacao",
    sortable: true,
  },
  {
    name: "estadoPlaqueta",
    align: "left",
    label: "ESTADO PLAQUETA",
    field: "estadoPlaqueta",
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

const colunasVisiveis = ref([]);

const relatoriosOpcoes = ref([
  {
    nome: "",
    titulo: "Sem título",
    itemTipo: "",
    fn: null,
  },
  {
    nome: "bens-nao-coletados",
    titulo: "Bens não coletados",
    itemTipo: "itemImportado",
    fn: relatoriosStore.bensNaoEncontrados,
    colunasVisiveis: ["patrimonio", "descricao"],
  },
  {
    nome: "plaquetas-problemas",
    titulo: "Plaquetas com problemas",
    itemTipo: "itemColetado",
    fn: relatoriosStore.plaquetasComProblemas,
    colunasVisiveis: [
      "patrimonio",
      "descricao",
      "localizacao",
      "setorEncontrado",
      "dependenciaEncontrada",
      "estadoPlaqueta",
    ],
  },
  {
    nome: "sem-patrimonio",
    titulo: "Bens sem patrimônio",
    itemTipo: "itemColetado",
    fn: relatoriosStore.bensSemPatrimonio,
    colunasVisiveis: [
      "patrimonio",
      "descricao",
      "localizacao",
      "setorEncontrado",
      "dependenciaEncontrada",
    ],
  },
  {
    nome: "local-diferente",
    titulo: "Bens em outras unidades",
    itemTipo: "itemColetado",
    fn: relatoriosStore.localDiferente,
    colunasVisiveis: [
      "patrimonio",
      "descricao",
      "localizacao",
      "setorEncontrado",
      "setorPrevisto",
      "dependenciaEncontrada",
      "dependenciaPrevista",
    ],
  },
  {
    nome: "sem-itens",
    titulo: "Coletas sem itens",
    itemTipo: "itemColetado",
    fn: relatoriosStore.coletasSemItens,
    colunasVisiveis: [
      "patrimonio",
      "descricao",
      "localizacao",
      "setorEncontrado",
      "setorPrevisto",
      "dependenciaEncontrada",
      "dependenciaPrevista",
    ],
  },
  {
    nome: "repetidos",
    titulo: "Coletas repetidas",
    itemTipo: "itemColetado",
    fn: relatoriosStore.coletasRepetidas,
    colunasVisiveis: ["patrimonio", "qtde"],
  },
]);

const relatorioSelec = computed(() => {
  return relatoriosOpcoes.value.find(
    (relatorio) => relatorio.nome === nomeRelatorio.value
  );
});

watch(
  () => route.query,
  (query) => {
    nomeRelatorio.value = query.relatorio;
    relatorio.value = [];
    if (nomeRelatorio.value === "repetidos") {
      filtrarSetorDep();
    }
  }
);

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

const idSetor = computed(() => {
  return setor.value !== null && setor.value.hasOwnProperty("id")
    ? setor.value.id
    : "";
});

const idDependencia = computed(() => {
  return dependencia.value !== null && dependencia.value.hasOwnProperty("id")
    ? dependencia.value.id
    : "";
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
  idInventario = route.params["idInventario"];
  nomeRelatorio.value = route.query["relatorio"];
  if (nomeRelatorio.value !== "repetidos") {
    await setoresStore.buscarSetoresDependencias(idInventario);
  } else filtrarSetorDep();
});

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: relatorioSelec.value.itemTipo,
      params: { idItem: itensSelecionados.value[0].id },
    });
  }
}

function exportarDados() {
  exportTable(colunasItens, relatorio.value, "bens-sem-patrimonios");
}

async function filtrarSetorDep() {
  try {
    erro.value = null;
    await relatorioSelec.value.fn(
      idInventario,
      idSetor.value,
      idDependencia.value
    );
    if (erro.value && erro.value.response.status == "403") {
      throw new Error(erro.value.response.data);
    }
  } catch (error) {
    $q.dialog({ title: "Erro!", message: error.message });
  }
}

function limparFiltro() {
  setor.value = null;
  dependencia.value = null;
}
</script>

<template>
  <q-card bordered>
    <q-card-section v-if="nomeRelatorio !== 'repetidos'" class="q-gutter-sm">
      <q-select
        v-model="setor"
        outlined
        :options="setoresDependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Setor"
        dense
      />
      <q-select
        v-model="dependencia"
        outlined
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
      <q-separator inset />
    </q-card-section>
    <q-card-section>
      <!-- <q-card-section v-if="!carregando"> -->
      <q-table
        flat
        :loading="carregando"
        :title="relatorioSelec.titulo"
        :visible-columns="relatorioSelec.colunasVisiveis"
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
        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #top-right>
          <q-input
            v-model="filtro"
            borderless
            dense
            filled
            debounce="300"
            placeholder="Filtrar"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #loading>
          <q-inner-loading :showing="carregando">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox
                v-if="nomeRelatorio !== 'repetidos'"
                v-model="itensSelecionados"
                left-label
                :val="props.row"
              />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="props.expand = !props.expand"
            >
              <span>{{ diminuiTexto(col.value) }}</span>
            </q-td>
          </q-tr>
          <q-tr v-if="props.expand && props.row.descricao" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <span>{{ props.row.descricao }}></span>
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
