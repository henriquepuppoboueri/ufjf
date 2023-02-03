<template>
  <q-card square>
    <q-card-section>
      <q-table
        flat
        :loading="carregando"
        title="Itens coletados"
        :rows="itensNominais"
        :columns="colunasItens"
        row-key="id"
        separator="cell"
        selection="multiple"
        :wrap-cells="true"
        v-model:pagination="pagination"
        :filter="filter"
        @request="onRequest"
        :selected-rows-label="registroPortugues"
        :rows-per-page-options="[1, 5, 10, 15, 50]"
        :bordered="false"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
      >
        <!-- header -->
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- pesquisa -->
        <template v-slot:top-right>
          <div class="row q-gutter-sm">
            <q-input
              dense
              filled
              debounce="300"
              v-model="filter"
              placeholder="Filtrar"
              clearable
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <!-- corpo da tabela -->
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
        v-if="qtItensSelec && qtItensSelec === 1"
        dense
        color="blue"
        label="Editar"
        @click="editItem"
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
        @click="novoItem"
      />
      <q-btn
        v-if="!carregando"
        icon="download"
        dense
        color="green"
        label="Exportar"
        @click="exportTable(colunasItens, itensNominais, 'itens-coletados')"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { useSetoresStore } from "src/stores/setores";
import { storeToRefs } from "pinia";
import { useQuasar, Notify } from "quasar";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { exportTable } from "src/helper/functions";

const $q = useQuasar();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
const { itensColetados, carregando, paginacaoDados, itensNominais } =
  storeToRefs(itensColetadosStore);
const itensSelecionados = ref([]);
const filter = ref("");
const router = useRouter();
const route = useRoute();
let idInventario = route.params.idInventario || false;
const pagination = ref({
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: "id",
});
const colunasItens = reactive([
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
    name: "setor",
    align: "left",
    label: "SETOR",
    field: "setor",
    sortable: true,
  },
  {
    name: "dependencia",
    align: "left",
    label: "DEPENDÊNCIA",
    field: "dependencia",
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
    name: "situacao",
    align: "left",
    label: "SITUAÇÃO",
    field: "situacao",
    sortable: true,
  },
  {
    name: "estadoPlaqueta",
    align: "left",
    label: "ESTADO DA PLAQUETA",
    field: "estadoPlaqueta",
    sortable: true,
  },
  {
    name: "usuario",
    align: "left",
    label: "USUÁRIO",
    field: "usuario",
    sortable: true,
  },
]);
const fetchData = async (
  page = 0,
  sortBy = "id",
  sortDirection = "asc",
  filter = "",
  rowsPerPage = 10
) => {
  try {
    await itensColetadosStore.buscarItensColetados(
      idInventario,
      page,
      rowsPerPage,
      `${sortBy},${sortDirection}`,
      filter
    );
    pagination.value.page = paginacaoDados.value.currentPage + 1;
    pagination.value.sortBy = sortBy || "id";
    pagination.value.descending = sortDirection === "desc";
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.rowsNumber = paginacaoDados.value.totalElements;
  } finally {
  }
};

const onRequest = (props) => {
  fetchData(
    props.pagination.page - 1,
    props.pagination.sortBy,
    props.pagination.descending ? "desc" : "asc",
    props.filter,
    props.pagination.rowsPerPage
  );
};

// The initial fetch
fetchData();

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

onMounted(() => {
  renderPage();
});

watch(
  () => route.path,
  (to, from) => {
    renderPage();
  }
);

function editItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      path: `${route.path}/${itensSelecionados.value}`,
      query: route.query,
    });
  }
}

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: "itemColetado",
      params: { idItem: itensSelecionados.value[0] },
    });
  }
}

function novoItem() {
  if (itensSelecionados.value.length === 0) {
    router.push({
      name: "itemColetadoNovo",
    });
  }
}

function delItens() {
  if (itensSelecionados.value.length > 0) {
    $q.dialog({
      title: "Exclusão de itens",
      message:
        "Tem certeza de que deseja excluir o(s) item(ns) selecionado(s)?",
      cancel: { type: "button", label: "Cancelar", color: "primary" },
      ok: { type: "button", label: "Confirmar", color: "green" },
    }).onOk(async () => {
      for (const item of itensSelecionados.value) {
        try {
          await itensColetadosStore.delItemColetado(item);
          Notify.create({
            color: "green",
            message: `Item excluído!`,
          });
        } catch (err) {
          Notify.create({
            color: "red",
            message: `Erro ao excluir item: ${err}`,
          });
        } finally {
          itensSelecionados.value = [];
        }
      }
    });
  }
}

async function renderPage() {
  idInventario = route.params.idInventario || false;
  itensColetados.value = [];
  itensSelecionados.value = [];

  if (!idInventario) return;

  try {
    await setoresStore.buscarSetoresDependencias(idInventario);
    await itensColetadosStore.buscarItensColetados(idInventario);
  } catch (error) {}
}
</script>

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
