<script setup>
import { useQuasar } from 'quasar';

import {
  diminuiTexto,
  registroPortugues,
  exportTable,
} from '/helper/functions';
import { paginacaoOpcoes } from '/helper/qtableOpcoes';

const $q = useQuasar();
const route = useRoute();
const idInventario = ref(0);

const setoresStore = useSetoresStore();
const { setoresDependencias, setor, setorDependencias, dependencia } =
  storeToRefs(setoresStore);
const { buscarSetoresDependencias, buscarDepsDoSetor, $resetSetores } =
  setoresStore;

const situacaoStore = useSituacaoStore();
const { situacao, situacoes } = storeToRefs(situacaoStore);
const { buscarSituacoes, $resetSituacao } = situacaoStore;

const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);
const { buscarDadosRelatorio, $resetRelatorio } = relatoriosStore;

const itensSelecionados = ref([]);
const filtro = ref('');
const nomeRelatorio = ref('1212');

const itemSelecionado = computed(() => {
  return itensSelecionados.value[0] || null;
});

const relatorioSelec = computed(
  () =>
    relatoriosLista.find(
      (relatorio) => relatorio.nome === nomeRelatorio.value
    ) || null
);

const qtItensSelec = computed(() => {
  if (itensSelecionados.value && itensSelecionados?.value?.length) {
    return itensSelecionados.value.length;
  }
});

const idSetor = computed(() => {
  return setor.value !== null && setor.value.hasOwnProperty('id')
    ? setor.value.id
    : '';
});

const idDependencia = computed(() => {
  return dependencia.value !== null && dependencia.value.hasOwnProperty('id')
    ? dependencia.value.id
    : '';
});

const idTipoItem = computed(() =>
  relatorioSelec.value.itemTipo === 'itemColetado'
    ? 'idItemColetado'
    : 'idItemImportado' || 0
);

watch(itensSelecionados, (nv, ov) => {
  if (nv?.length > 1) {
    itensSelecionados.value.shift();
  }
});

watch(
  () => route.query,
  (query) => {
    nomeRelatorio.value = query.relatorio;
    $resetRelatorio();
    $resetSetores();
    $resetSituacao();
  }
);

watch(setor, async (nv, ov) => {
  if (nv) {
    setorDependencias.value = [];
    dependencia.value = null;
    await buscarDepsDoSetor(nv.id);
  }
});

onBeforeMount(async () => {
  idInventario.value = route.params['idInventario'];
  nomeRelatorio.value = route.query['nome'];
  await buscarSetoresDependencias(idInventario.value);
  await buscarSituacoes();
});

function exportarDados() {
  exportTable(tabelaColunas, relatorio.value, 'bens-sem-patrimonios');
}

async function filtrarSetorDep() {
  try {
    erro.value = null;
    await buscarDadosRelatorio({
      nome: nomeRelatorio.value,
      params: {
        idInventario: idInventario.value,
        idSetor: idSetor.value,
        idDependencia: idDependencia?.value,
        idSituacao: situacao?.value?.id || null,
      },
    });
    if (erro.value && erro.value.response.status == '403') {
      throw new Error(erro.value.response.data);
    }
  } catch (error) {
    $q.dialog({ title: 'Erro!', message: error.message });
  }
}

function limparFiltro() {
  $resetRelatorio();
  $resetSetores();
  $resetSituacao();
}
</script>

<template>
  <q-card bordered>
    <q-card-section class="text-center text-h5">
      {{ relatorioSelec?.descricao }}
    </q-card-section>
    <q-card-section v-if="!carregando" class="q-gutter-sm">
      <q-select
        v-if="relatorioSelec?.filtros?.includes('setor')"
        v-model="setor"
        outlined
        :options="setoresDependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Setor"
        dense
      />
      <q-select
        v-if="relatorioSelec?.filtros?.includes('dependencia')"
        v-model="dependencia"
        outlined
        :options="setorDependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Dependência"
        dense
      />
      <q-select
        v-if="relatorioSelec?.filtros?.includes('situacao')"
        v-model="situacao"
        outlined
        :options="situacoes"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Situação"
        dense
      />
      <p v-if="!relatorioSelec?.filtros?.length">
        Este relatório não possui filtros adicionais. Clique em Pesquisar para
        continuar.
      </p>
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
        v-if="relatorioSelec.filtros?.length"
        :disable="carregando"
        dense
        size="0.7rem"
        color="green"
        label="Limpar filtro"
        @click="limparFiltro"
      />
      <q-separator inset />
    </q-card-section>
    <q-card-section v-if="carregando">
      <q-inner-loading :showing="carregando">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card-section>
    <q-card-section>
      <q-table
        v-if="relatorio && !carregando"
        flat
        :loading="carregando"
        :visible-columns="relatorioSelec.colunasVisiveis"
        :rows="relatorio"
        :columns="relatorioColunas"
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

        <template #body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox
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
    <q-card-actions v-if="!carregando && relatorio" class="q-gutter-sm">
      <q-btn
        v-if="qtItensSelec && qtItensSelec === 1"
        dense
        color="orange"
        class="text-white"
        label="Visualizar"
        :to="{
          name: relatorioSelec.itemTipo,
          params: { [idTipoItem]: itemSelecionado.id },
        }"
      ></q-btn>
      <q-btn
        dense
        color="red"
        class="text-white"
        label="Exportar"
        @click="exportarDados"
      />
    </q-card-actions>
  </q-card>
</template>

<style></style>
