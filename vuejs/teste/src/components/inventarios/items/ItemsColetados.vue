<template>
  <q-table
    v-if="idInventario !== 0"
    :loading="loadingItems"
    :title="origem === 'lancados' ? 'Itens coletados' : 'Itens importados'"
    :rows="itemsInventario"
    :columns="colunasItems"
    row-key="id"
    separator="cell"
    :wrap-cells="true"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
    :filter="filtro"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
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
        <q-td auto-width>
          <q-btn
            size="sm"
            :color="props.row.id === idItemSelecionado ? 'red' : 'green'"
            round
            dense
            @click="selecionaItem(props.row.id)"
            :icon="props.row.id === idItemSelecionado ? 'remove' : 'add'"
            :disabled="props.origem === 'itens_originais'"
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
  <q-btn
    v-if="habilitaBtnSalvar"
    class="q-mt-md q-ml-md"
    :disabled="!habilitaBtnSalvar"
    color="primary"
    icon="check"
    label="Salvar"
  />
  <!-- <ItemCad v-if="idItemSelecionado !== 0" :id="idItemSelecionado"> </ItemCad> -->
  <router-view></router-view>
</template>

<script setup>
import {
  onUnmounted,
  onUpdated,
  onBeforeUpdate,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
} from "vue";
import axios from "axios";
import { API_URL } from "../../../helper/constants.js";
import ItemCad from "./item/ItemCad.vue";
import { useRoute } from "vue-router";
import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { Notify } from "quasar";

const filtro = ref("");
const setores = ref([]);
const dependencias = ref([]);
const route = useRoute();
const inventarios = reactive([]);
const itemsInventario = ref([]);
const idInventario = ref(0);
const idItemSelecionado = ref(0);
const origem = ref("");

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

onMounted(() => {
  renderPage();

  // setTimeout(() => {
  //   loadingItems.value = true;
  // }, 5000);
});

watch(route, () => {
  renderPage();
});

function renderPage() {
  itemsInventario.value = [];
  const id = route.params.idInventario || false;
  origem.value = route.query.origem || false;

  if (!id || !origem.value) {
    return;
  }

  let urlDestino = "";
  if (origem.value === "lancados") urlDestino = "coleta";
  else urlDestino = "itens";

  loadingItems.value = true;
  axios
    .get(`${API_URL}v1/restrito/inventario/setor/dependencia/${id}`)
    .then((res) => {
      setores.value = res.data;
      idInventario.value = id;
      return axios.get(`${API_URL}v1/restrito/item/${urlDestino}/${id}`);
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
