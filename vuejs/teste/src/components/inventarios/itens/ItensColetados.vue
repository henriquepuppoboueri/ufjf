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
        class="my-sticky-header-table"
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
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
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
              {{ refatoraTexto(col.name, col.value) }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                {{ props.row.descricao }}
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
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";
import { useSetoresStore } from "src/stores/setores";
import { useDependenciasStore } from "src/stores/dependencias";
import { storeToRefs } from "pinia";
import { useQuasar, Notify } from "quasar";
import { useItensColetadosStore } from "src/stores/itensColetados";

const $q = useQuasar();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
const { itensColetados, carregando, itensNominais } =
  storeToRefs(itensColetadosStore);
const itensSelecionados = ref([]);
const filtro = ref("");
const router = useRouter();
const route = useRoute();
const colunasItens = reactive([
  // {
  //   name: "id",
  //   align: "left",
  //   label: "ID",
  //   field: "id",
  //   sortable: true,
  // },
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
  {
    name: "estadoPlaqueta",
    align: "left",
    label: "ESTADO DA PLAQUETA",
    field: "estadoPlaqueta",
    sortable: true,
  },
]);
const colunasFiltro = ref([]);

function filtroAvancado(row, terms, cols, getCellValue) {
  // const columnsValues = terms.split("=").map((term) => term.toLowerCase());
  // // console.log(columnsValues);
  // if (columnsValues.length > 1)
  //   return row.filter((item) => {
  //     console.log(item[columnsValues[0]]);
  //     return item[columnsValues[0]].toLowerCase().includes(columnsValues[1]);
  //   });
  // else {
  //   return row;
  // }
  // console.log(row.filter((item) => item["situacao"].includes("")));
  // row.forEach((item) => console.log(item["setor"]));
  if (!terms) return row;

  if (colunasFiltro.value.hasOwnProperty("field")) {
    return row.filter((item) =>
      item[colunasFiltro.value.field]
        .toLowerCase()
        .includes(terms.toLowerCase())
    );
  }

  // return row;
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
      console.log(itensSelecionados.value);
      for (const item of itensSelecionados.value) {
        console.log(item);
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

function refatoraTexto(colNome, colValor) {
  switch (colNome) {
    // case "setor":
    //   return buscarSetorPorId(colValor);
    //   break;
    // case "dependencia":
    //   return buscarDependenciaPorId(colValor);
    //   break;

    default:
      return diminuiTexto(colValor);
      break;
  }
}

async function renderPage() {
  itensColetados.value = [];
  itensSelecionados.value = [];
  const id = route.params.idInventario || false;

  if (!id) return;

  try {
    await setoresStore.buscarSetoresDependencias(id);
    await itensColetadosStore.buscarItensColetados(id);
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
