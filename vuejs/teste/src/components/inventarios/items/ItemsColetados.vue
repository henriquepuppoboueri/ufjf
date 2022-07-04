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
    v-if="idInventarioSelecionado"
    class="q-mt-lg"
    title="Items coletados"
    :rows="itemsInventario"
    :columns="colunasItems"
    row-key="id"
    selection="single"
    v-model:selected="itemSelecionado"
  />
  <q-btn
    v-if="habilitarEdicaoItem"
    class="q-mt-md q-ml-md"
    :disabled="!habilitarEdicaoItem"
    color="primary"
    icon="check"
    label="Salvar"
  />
  <ItemCad v-if="habilitarEdicaoItem" ItemCad :id="idItemSelecionado">
  </ItemCad>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import axios from "axios";
import { API_URL } from "../../../helper/constants.js";
import ItemCad from "./item/ItemCad.vue";

const inventarios = reactive([]);
const inventarioSelecionado = ref([]);
const itemSelecionado = ref([]);
const itemsInventario = ref([]);

const idInventarioSelecionado = computed(() => {
  if (inventarioSelecionado.value.length === 0) {
    return 0;
  }

  return +inventarioSelecionado.value[0].id;
});
const idItemSelecionado = computed(() => {
  if (itemSelecionado.value.length === 0) {
    return 0;
  }

  return +itemSelecionado.value[0].id;
});

// watch(itemSelecionado, () => {
//   const item = +itemSelecionado.value[0];
//   if (item) {
//   }
// });

// const mostrarDialog = computed(() => {
//   return true;
// });

const habilitarEdicaoItem = computed((_) => {
  return (
    itemSelecionado.value.length > 0 && inventarioSelecionado.value.length > 0
  );
});

watch(idInventarioSelecionado, (_) => {
  if (idInventarioSelecionado.value === 0) {
    itemSelecionado.value = [];
    return;
  }

  axios
    .get(`${API_URL}v1/restrito/item/coleta/${idInventarioSelecionado.value}`)
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
