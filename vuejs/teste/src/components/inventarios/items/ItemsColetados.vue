<template>
  <q-table
    v-if="idInventario !== 0"
    :loading="loadingItems"
    title="Items coletados"
    :rows="itemsInventario"
    :columns="colunasItems"
    row-key="id"
    separator="cell"
    :wrap-cells="true"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
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
  <ItemCad v-if="idItemSelecionado !== 0" :id="idItemSelecionado"> </ItemCad>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import axios from "axios";
import { API_URL } from "../../../helper/constants.js";
import ItemCad from "./item/ItemCad.vue";
import { useRoute } from "vue-router";
import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { Notify } from "quasar";

const setores = ref([]);
const dependencias = ref([]);
const route = useRoute();
// const props = defineProps({ idInventario: String });
const inventarios = reactive([]);
const itemsInventario = ref([]);
const idInventario = ref(0);
const idItemSelecionado = ref(0);

const loadingInventarios = ref(false);
const loadingItems = ref(false);

const colunasItems = reactive([
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
  const id = "id" in route.params ? +route.params.id : 0;
  if (!id) {
    return;
  }

  loadingItems.value = true;
  axios
    .get(`${API_URL}v1/restrito/inventario/setor/${id}`)
    .then((res) => {
      setores.value = res.data;
      idInventario.value = id;
      return axios.get(`${API_URL}v1/restrito/item/coleta/${id}`);
    })
    .then((coleta) => {
      if (coleta.data.length > 0) {
        const resData = coleta.data.map((item) => {
          return {
            ...item,
            setor: setores.value.find((setor) => setor.id === item.setor).nome,
          };
        });
        itemsInventario.value = resData;
      }
    })
    .catch((err) => {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    });

  loadingItems.value = false;
});

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
