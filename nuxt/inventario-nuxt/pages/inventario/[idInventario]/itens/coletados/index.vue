<script setup>
import { useQuasar, Notify } from 'quasar';

import { diminuiTexto, registroPortugues } from '/helper/functions';
import { paginacaoOpcoes } from '/helper/qtableOpcoes';
import { exportTable } from '/helper/functions';
import ItemPatrimonio from '/components/inventarios/itens/ItemPatrimonio.vue';

definePageMeta({ name: 'itensColetados' });

const $q = useQuasar();
const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);

const usuariosStore = useUsuariosStore();
const { usuarios } = storeToRefs(usuariosStore);
const { buscarUsuarios } = usuariosStore;

const situacaoStore = useSituacaoStore();
const { situacoes } = storeToRefs(situacaoStore);
const { buscarSituacoes } = situacaoStore;

const plaquetaStore = usePlaquetaStore();
const { estadosPlaquetas } = storeToRefs(plaquetaStore);
const { buscarEstadosPlaquetas } = plaquetaStore;

const inventariosStore = useInventariosStore();
const { usuariosInventario } = storeToRefs(inventariosStore);
const { buscarUsuariosInventario } = inventariosStore;

const isAdminInventario = usuariosInventario.value
  .filter((usuario) => usuario.admin)
  .map((usuario) => usuario.id)
  .includes(usuario.value.id);

const setoresStore = useSetoresStore();
const { setoresDependencias } = storeToRefs(setoresStore);
const { buscarSetoresDependencias } = setoresStore;
const dependencias = computed(() => {
  if (filter.setor) {
    return filter.setor.dependencias;
  }
  return [];
});

const itensColetadosStore = useItensColetadosStore();
const { itensColetados, carregando, carregandoTodos, paginacaoMeta } =
  storeToRefs(itensColetadosStore);
const { buscarItensColetados } = itensColetadosStore;

const itensSelecionados = ref([]);

const filter = reactive({});
const router = useRouter();
const route = useRoute();
const colunasItens = reactive([
  {
    name: 'patrimonio',
    align: 'left',
    label: 'PATRIMÔNIO',
    field: 'patrimonio',
    sortable: true,
    component: { name: 'input' },
  },
  {
    name: 'descricao',
    align: 'left',
    label: 'DESCRIÇÃO',
    field: 'descricao',
    sortable: true,
    component: { name: 'input' },
  },
  {
    name: 'setor',
    align: 'left',
    label: 'SETOR',
    field: (item) => item.setor.nome,
    sortable: true,
    component: {
      name: 'select',
      idField: 'id',
      labelField: 'nome',
      dataSource: setoresDependencias,
    },
  },
  {
    name: 'dependencia',
    align: 'left',
    label: 'DEPENDÊNCIA',
    field: (item) => item.dependencia.nome,
    sortable: true,
    component: {
      name: 'select',
      idField: 'id',
      labelField: 'nome',
      dataSource: dependencias,
    },
  },
  {
    name: 'localizacao',
    align: 'left',
    label: 'LOCALIZAÇÃO',
    field: 'localizacao',
    sortable: true,
    component: { name: 'input' },
  },
  {
    name: 'situacao',
    align: 'left',
    label: 'SITUAÇÃO',
    field: (item) => item.situacao.nome,
    sortable: true,
    component: {
      name: 'select',
      idField: 'id',
      labelField: 'nome',
      dataSource: situacoes,
    },
  },
  {
    name: 'estadoPlaqueta',
    align: 'left',
    label: 'ESTADO DA PLAQUETA',
    field: (item) => item.estadoPlaqueta.nome,
    sortable: true,
    component: {
      name: 'select',
      idField: 'id',
      labelField: 'nome',
      dataSource: estadosPlaquetas,
    },
  },
  {
    name: 'usuario',
    align: 'left',
    label: 'USUÁRIO',
    field: 'usuario',
    sortable: true,
    component: {
      name: 'select',
      idField: 'id',
      labelField: 'login',
      dataSource: usuarios,
    },
  },
  {
    name: 'identificador',
    align: 'left',
    label: 'IDENTIFICADOR',
    field: 'identificador',
    sortable: true,
    component: { name: 'input' },
  },
]);
const colunasFiltro = ref([]);
const colunasMostrar = ref([
  {
    name: 'patrimonio',
    align: 'left',
    label: 'PATRIMÔNIO',
    field: 'patrimonio',
    sortable: true,
  },
  {
    name: 'descricao',
    align: 'left',
    label: 'DESCRIÇÃO',
    field: 'descricao',
    sortable: true,
  },
  {
    name: 'setor',
    align: 'left',
    label: 'SETOR',
    field: 'setor',
    sortable: true,
  },
  {
    name: 'dependencia',
    align: 'left',
    label: 'DEPENDÊNCIA',
    field: 'dependencia',
    sortable: true,
  },
  {
    name: 'situacao',
    align: 'left',
    label: 'SITUAÇÃO',
    field: 'situacao',
    sortable: true,
  },
]);
const idInventario = ref(route.params.idInventario || false);

function filtroAvancado(row, terms, cols, getCellValue) {
  if (!terms) return row;

  if (colunasFiltro.value.hasOwnProperty('field')) {
    return row.filter((item) =>
      item[colunasFiltro.value.field]
        .toLowerCase()
        .includes(terms.toLowerCase())
    );
  }

  const data = row.filter((item) => {
    return Object.values(item)
      .toString()
      .toLowerCase()
      .includes(terms.toLowerCase());
  });

  return data;
}

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

onBeforeMount(async () => {
  await buscarUsuariosInventario(idInventario.value);
  await buscarSetoresDependencias(idInventario.value);
  await buscarEstadosPlaquetas();
  await buscarUsuarios();

  await renderPage();
});

const pagination = ref({
  descending: false,
  sortBy: 'id',
  descricao: '',
  idDependencia: 0,
  idPlaqueta: 0,
  idSetor: 0,
  idSituacao: 0,
  idTipoColeta: 0,
  idUsuario: 0,
  localizacao: '',
  numIdentificador: '',
  numPatrimonio: '',
  page: 0,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const fetchData = async ({
  ascendente = true,
  campoOrderBy = 'id',
  descricao = '',
  idDependencia = 0,
  idPlaqueta = 0,
  idSetor = 0,
  idSituacao = 0,
  idTipoColeta = 0,
  idUsuario = 0,
  localizacao = '',
  numIdentificador = '',
  numPatrimonio = '',
  paginaAtual = 0,
  tamanho = paginacaoOpcoes.rowsPerPage,
} = {}) => {
  try {
    itensColetados.value = [];
    await itensColetadosStore.buscarItensColetadosPaginados(
      idInventario.value,
      {
        ascendente,
        campoOrderBy,
        descricao,
        idDependencia,
        idPlaqueta,
        idSetor,
        idSituacao,
        idTipoColeta,
        idUsuario,
        localizacao,
        numIdentificador,
        numPatrimonio,
        paginaAtual,
        tamanho,
      }
    );

    pagination.value.page = paginacaoMeta.value.number + 1;
    pagination.value.sortBy = campoOrderBy;
    pagination.value.descending = ascendente;
    pagination.value.rowsPerPage = tamanho;
    pagination.value.rowsNumber = paginacaoMeta.value.totalElements;
  } finally {
  }
};

const onRequest = async (props) => {
  await fetchData({
    ...props.pagination,
    campoOrderBy: props.pagination.sortBy,
    ascendente: props.pagination.descending,
    paginaAtual: props.pagination.page - 1,
    tamanho: props.pagination.rowsPerPage,
    numPatrimonio: props.filter.patrimonio,
    descricao: props.filter.descricao,
    localizacao: props.filter.localizacao,
    idSetor: props.filter.setor ? props.filter.setor.id : 0,
    idDependencia: props.filter.dependencia ? props.filter.dependencia.id : 0,
    idPlaqueta: props.filter.estadoPlaqueta
      ? props.filter.estadoPlaqueta.id
      : 0,
    idSituacao: props.filter.situacao ? props.filter.situacao.id : 0,
    idUsuario: props.filter.usuario ? props.filter.usuario.id : 0,
    numIdentificador: props.filter.identificador,
  });
};

watch(
  () => route.path,
  (to, from) => {
    renderPage();
  }
);

function clearFilter() {
  Object.keys(filter).forEach((key) => delete filter[key]);
}

function editItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      path: `${route.path}/${itensSelecionados.value[0].id}`,
      query: route.query,
    });
  }
}

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: 'itemColetado',
      params: { idItem: itensSelecionados.value[0].id },
    });
  }
}

function novoItem() {
  if (itensSelecionados.value.length === 0) {
    router.push({
      name: 'itemColetadoNovo',
    });
  }
}

function delItens() {
  if (itensSelecionados.value.length > 0) {
    $q.dialog({
      title: 'Exclusão de itens',
      message:
        'Tem certeza de que deseja excluir o(s) item(ns) selecionado(s)?',
      cancel: { type: 'button', label: 'Cancelar', color: 'primary' },
      ok: { type: 'button', label: 'Confirmar', color: 'green' },
    }).onOk(async () => {
      for (const item of itensSelecionados.value) {
        try {
          await itensColetadosStore.delItemColetado(item.id);
          Notify.create({
            color: 'green',
            message: `Item excluído!`,
          });
        } catch (err) {
          Notify.create({
            color: 'red',
            message: `Erro ao excluir item: ${err}`,
          });
        } finally {
          itensSelecionados.value = [];
        }
      }
    });
  }
}

function vincularPatrimonio() {
  $q.dialog({
    component: ItemPatrimonio,
    componentProps: {
      idInventario: idInventario.value,
      idItemColetado: String(itensSelecionados.value[0].id),
    },
  })
    .onOk(() => {
      console.log('OK');
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}

async function renderPage() {
  if (!idInventario.value) return;
  await buscarSetoresDependencias(idInventario.value);
}

fetchData();
</script>

<template>
  <q-card square>
    <q-card-section>
      <q-table
        v-model:pagination="pagination"
        flat
        :loading="carregando"
        title="Itens coletados"
        :rows="itensColetados"
        :columns="colunasItens"
        row-key="id"
        separator="cell"
        selection="multiple"
        :wrap-cells="true"
        :filter-method="filtroAvancado"
        :selected-rows-label="registroPortugues"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50, 100, 0]"
        :bordered="false"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
        :filter="filter"
        @request="onRequest"
      >
        <!-- header -->
        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- pesquisa -->
        <template #top-right>
          <div class="row q-gutter-sm fit full-width">
            <q-select
              v-model="colunasFiltro"
              class="fit"
              dense
              filled
              :options="colunasItens"
              multiple
              stack-label
              label="Filtrar por coluna"
              clearable
              @clear="clearFilter"
            >
              <template #option="{ itemProps, opt, selected, toggleOption }">
                <q-item v-bind="itemProps">
                  <q-item-section>
                    <q-item-label> {{ opt.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div v-for="col in colunasFiltro" :key="col.name" class="col">
              <q-input
                v-if="col.component.name === 'input'"
                v-model="filter[col.name]"
                dense
                borderless
                filled
                debounce="300"
                :placeholder="`Filtrar por ${col.label}`"
                clearable
                :label="col.label"
                @clear="() => (filter[col.name] = '')"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-select
                v-if="col.component.name === 'select'"
                v-model="filter[col.name]"
                dense
                :option-value="col.component.idField"
                :options="col.component.dataSource"
                :option-label="col.component.labelField"
                :label="col.label"
                filled
              />
            </div>
          </div>
        </template>

        <template #loading>
          <q-inner-loading :showing="carregando">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </template>

        <!-- corpo da tabela -->
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
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <span>{{ props.row.descricao }}</span>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions class="q-gutter-sm">
      <q-btn
        v-if="qtItensSelec && qtItensSelec === 1"
        dense
        color="orange"
        class="text-white"
        label="Visualizar"
        :to="`${$route.path}/${itensSelecionados[0].id}`"
      />
      <q-btn
        v-if="
          qtItensSelec &&
          qtItensSelec === 1 &&
          (isAdminInventario || itensSelecionados[0].usuario === usuario.login)
        "
        dense
        color="blue"
        label="Editar"
        :to="`${$route.path}/${itensSelecionados[0].id}`"
      />
      <q-btn
        v-if="qtItensSelec && qtItensSelec > 0"
        dense
        color="primary"
        label="Excluir"
        @click="delItens"
      />
      <q-btn
        v-if="!qtItensSelec && qtItensSelec === 0"
        dense
        color="green"
        label="Novo"
        :to="`${$route.path}/adicionar`"
      />
      <q-btn
        v-if="!carregando && !qtItensSelec"
        icon="download"
        dense
        color="green"
        label="Exportar"
        :disabled="carregandoTodos"
        @click="exportTable(colunasItens, itensColetados, 'itens-coletados')"
      />

      <q-btn
        v-if="
          !carregando &&
          qtItensSelec === 1 &&
          itensSelecionados[0].patrimonio === ''
        "
        dense
        color="purple"
        label="Vincular patrimônio"
        @click="vincularPatrimonio"
      />
    </q-card-actions>
  </q-card>
</template>

<style lang="sass">

.q-card__section--vert
  padding: 0

.q-dialog-plugin
  padding: 0.5rem

.q-dialog__title
  text-align: center

.q-btn
  min-width: 5rem
</style>
