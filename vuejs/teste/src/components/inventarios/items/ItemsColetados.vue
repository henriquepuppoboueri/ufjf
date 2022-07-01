<template>
  <!-- <q-dialog v-model=""> </q-dialog> -->
  <q-table
    title="Inventários"
    :rows="inventarios"
    :columns="colunasInventarios"
    row-key="id"
    selection="single"
    v-model:selected="inventarioSelecionado"
  />
  <q-table
    v-if="idSelecionado"
    class="q-mt-lg"
    title="Items coletados"
    :rows="itemsInventario"
    :columns="colunasItems"
    row-key="id"
    selection="single"
    v-model:selected="itemSelecionado"
  />
  <q-btn
    class="q-mt-md"
    :disabled="!itemSelecionado"
    color="primary"
    icon="check"
    label="Editar/visualizar item"
    @click="onClick"
  />
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import axios from "axios";
import { API_URL } from "../../../helper/constants.js";

const inventarios = reactive([]);
const inventarioSelecionado = ref([]);
const itemSelecionado = ref([]);
const itemsInventario = ref([]);
const dialog = ref(false);

const idSelecionado = computed(() => {
  if (inventarioSelecionado.value.length === 0) {
    return 0;
  }

  return +inventarioSelecionado.value[0].id;
});

// watch(itemSelecionado, () => {
//   const item = +itemSelecionado.value[0];
//   if (item) {
//   }
// });

// const mostrarDialog = computed(() => {
//   return true;
// });

watch(itemSelecionado, (_) => {
  console.log(itemSelecionado.value[0]);
});

watch(idSelecionado, (_) => {
  if (idSelecionado.value === 0) return;
  axios
    .get(`${API_URL}v1/restrito/item/coleta/${idSelecionado.value}`)
    .then((res) => {
      itemsInventario.value = res.data;
    });
});

const colunasInventarios = reactive([
  {
    name: "nome",
    align: "left",
    label: "Nome",
    field: "nome",
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "situacaoInventario",
  },
]);

const colunasItems = reactive([
  {
    name: "patrimonio",
    align: "left",
    label: "Patrimônio",
    field: "patrimonio",
  },
  {
    name: "descricao",
    align: "left",
    label: "Descrição",
    field: "descricao",
  },
]);

onMounted(() => {
  axios
    .get(`${API_URL}v1/restrito/inventario`)
    .then((res) => {
      Object.assign(inventarios, res.data);
    })
    .catch(console.log);
});
</script>
