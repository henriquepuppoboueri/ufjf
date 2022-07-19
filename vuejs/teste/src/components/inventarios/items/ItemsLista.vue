<template>
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
    title="Items"
    :rows="itemsInventario"
    :columns="colunasItems"
    row-key="id"
  />
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import { api } from "boot/axios";

const inventarios = reactive([]);
const inventarioSelecionado = ref([]);
const itemsInventario = ref([]);

const idSelecionado = computed(() => {
  if (inventarioSelecionado.value.length === 0) {
    return 0;
  }

  return +inventarioSelecionado.value[0].id;
});

watch(idSelecionado, (_) => {
  if (idSelecionado.value === 0) return;
  api.get(`v1/restrito/item/itens/${idSelecionado.value}`).then((res) => {
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
  api
    .get(`v1/restrito/inventario`)
    .then((res) => {
      Object.assign(inventarios, res.data);
    })
    .catch(console.log);
});
</script>
