<template>
  <q-table
    v-if="idInventario !== 0"
    :loading="loadingItems"
    :title="origemItens === 'lancados' ? 'Itens coletados' : 'Itens importados'"
    :rows="itemsInventario"
    :columns="colunasItems"
    row-key="id"
    separator="cell"
    selection="multiple"
    :wrap-cells="true"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
    :filter="filtro"
    class="my-sticky-header-table"
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
        <q-td
          ><q-checkbox
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
          {{ diminuiTexto(col.value) }}
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
  <q-card-actions>
    <q-btn
      v-if="qtItensSelec && qtItensSelec === 1"
      dense
      color="orange"
      class="text-white"
      label="Visualizar"
    />
    <q-btn
      v-if="qtItensSelec && qtItensSelec === 1"
      dense
      color="blue"
      label="Editar"
    />
    <q-btn
      v-if="qtItensSelec && qtItensSelec > 0"
      dense
      color="primary"
      label="Excluir"
    />
    <q-btn
      v-if="!qtItensSelec && qtItensSelec === 0"
      dense
      color="green"
      label="Novo"
    />
  </q-card-actions>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { useRoute } from "vue-router";
import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { Notify } from "quasar";

const itensSelecionados = ref([]);
const filtro = ref("");
const setores = ref([]);
const dependencias = ref([]);
const route = useRoute();
const inventarios = reactive([]);
const itemsInventario = ref([]);
const idInventario = ref(0);
const idItemSelecionado = ref(0);
const origemItens = ref("");

const loadingInventarios = ref(false);
const loadingItems = ref(false);

const colunasItems = reactive([
  {
    name: "id",
    align: "left",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "patrimonio",
    align: "left",
    label: "Patrimônio",
    field: "patrimonio",
    sortable: true,
  },
  {
    name: "descricao",
    align: "left",
    label: "Descrição",
    field: "descricao",
    sortable: true,
  },
  {
    name: "setor",
    align: "left",
    label: "Setor",
    field: "setor",
    sortable: true,
  },
  {
    name: "dependencia",
    align: "left",
    label: "Dependência",
    field: "dependencia",
    sortable: true,
  },
]);

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

onMounted(() => {
  renderPage();
});

watch(route, () => {
  renderPage();
});

function renderPage() {
  itemsInventario.value = [];
  const id = route.params.idInventario || false;
  origemItens.value = route.query.origemItens || false;

  if (!id || !origemItens.value) {
    return;
  }
  console.log(route);

  let urlDestino = "";
  if (origemItens.value === "lancados") urlDestino = "coleta";
  else urlDestino = "itens";

  loadingItems.value = true;
  api
    .get(`v1/restrito/inventario/setor/dependencia/${id}`)
    .then((res) => {
      setores.value = res.data;
      idInventario.value = id;
      return api.get(`v1/restrito/item/${urlDestino}/${id}`);
    })
    .then((res) => {
      if (res.data.length > 0) {
        const resData = res.data.map((item) => {
          const setor =
            setores.value.find((setor) => setor.id === item.setor) ||
            "Sem unidade";

          let dependencia_ = "Sem dependência";
          if (
            setor !== "Sem unidade" &&
            setor.hasOwnProperty("dependencias") &&
            setor.dependencias.length > 0
          ) {
            dependencia_ =
              setor.dependencias.find(
                (dependencia) => dependencia.id === item.dependencia
              ).nome || "Sem dependência";
          }

          return {
            ...item,
            setor: setor.nome || "Sem unidade",
            dependencia: dependencia_,
          };
        });
        itemsInventario.value = resData;
      }
      loadingItems.value = false;
    })
    .catch((err) => {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    });
}

function selecionaItem(idItem) {
  if (idItemSelecionado.value === idItem) {
    idItemSelecionado.value = 0;
    return;
  }
  idItemSelecionado.value = idItem;
}

function extraiSetor(id) {
  return setores.value.find((s) => s.id === text).nome;
}

const habilitaBtnSalvar = computed(() => {
  return idItemSelecionado.value !== 0;
});
</script>

<!-- <style>
.q-btn {
  min-width: 5rem;
}
</style> -->

<style lang="sass">
.my-sticky-header-table
  // /* height or max-height is important */
  // height: calc(100vh - 150px)

  // .q-table__top,
  // .q-table__bottom,
  // thead tr:first-child th
  //   /* bg color is important for th; just specify one */
  //   background-color: white

  // thead tr th
  //   position: sticky
  //   z-index: 1
  // thead tr:first-child th
  //   top: 0

  // /* this is when the loading indicator appears */
  // &.q-table--loading thead tr:last-child th
  //   /* height of all previous header rows */
  //   top: 48px

.q-btn
  min-width: 5rem
</style>
