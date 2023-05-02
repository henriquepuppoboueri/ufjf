<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";
import { useSetoresStore } from "src/stores/setores";
import { useInventariosStore } from "src/stores/inventarios";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { exportTable } from "src/helper/functions";
import { useAuthStore } from "src/stores/auth";

const $q = useQuasar();
const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);

const inventariosStore = useInventariosStore();
const { usuariosInventario } = storeToRefs(inventariosStore);
const { buscarUsuariosInventario } = inventariosStore;

const isAdminInventario = usuariosInventario.value
  .filter((usuario) => usuario.admin)
  .map((usuario) => usuario.id)
  .includes(usuario.value.id);

const setoresStore = useSetoresStore();

const itensColetadosStore = useItensColetadosStore();
const { itensColetados, carregando, itensNominais } =
  storeToRefs(itensColetadosStore);

const itensSelecionados = ref([]);
const itensSelecionadosArray = ref([]);

const filtro = ref("");
const router = useRouter();
const route = useRoute();
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
const colunasFiltro = ref([]);
const colunasMostrar = ref([
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
    name: "situacao",
    align: "left",
    label: "SITUAÇÃO",
    field: "situacao",
    sortable: true,
  },
]);
const idInventario = ref(route.params.idInventario || false);

function filtroAvancado(row, terms, cols, getCellValue) {
  if (!terms) return row;

  if (colunasFiltro.value.hasOwnProperty("field")) {
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

onMounted(() => {
  buscarUsuariosInventario(idInventario.value);
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
      path: `${route.path}/${itensSelecionados.value[0].id}`,
      query: route.query,
    });
  }
}

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: "itemColetado",
      params: { idItem: itensSelecionados.value[0].id },
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
          await itensColetadosStore.delItemColetado(item.id);
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
  itensColetados.value = [];
  itensSelecionados.value = [];

  if (!idInventario.value) return;

  try {
    await setoresStore.buscarSetoresDependencias(idInventario.value);
    await itensColetadosStore.buscarItensColetados(idInventario.value);
  } catch (error) {}
}
</script>

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
        :filter="filtro"
        :filter-method="filtroAvancado"
        :selected-rows-label="registroPortugues"
        :pagination="paginacaoOpcoes"
        :rows-per-page-options="[5, 10, 20, 50, 100, 0]"
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
            <q-select
              dense
              filled
              v-model="colunasFiltro"
              :options="colunasItens"
              stack-label
              label="Filtrar por coluna"
              single
              clearable
              @clear="() => (colunasFiltro = [])"
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    <q-item-label v-html="opt.label" />
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
            <q-input
              borderless
              dense
              filled
              debounce="300"
              v-model="filtro"
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
                :val="props.row"
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
        v-if="
          qtItensSelec &&
          qtItensSelec === 1 &&
          (isAdminInventario || itensSelecionados[0].usuario === usuario.login)
        "
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
        v-if="!carregando && !qtItensSelec"
        icon="download"
        dense
        color="green"
        label="Exportar"
        @click="exportTable(colunasItens, itensNominais, 'itens-coletados')"
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
