<template>
  <q-table
    title="Inventários"
    :rows="inventarios"
    :columns="colunas"
    row-key="id"
    selection="single"
    v-model:selected="inventarioSelecionado"
  />
  <q-btn
    class="q-mt-md q-ml-md"
    :disabled="inventarioSelecionado.length === 0"
    color="primary"
    icon="check"
    label="Editar/visualizar item"
    @click="editarInventario"
  />
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_URL } from "../../helper/constants.js";

const inventarioSelecionado = ref([]);
const inventarios = reactive([
  // {
  //   id: "1",
  //   nome: "Inventário 001",
  //   criador: "Marjory",
  //   dataCriacao: Date.now(),
  //   status: "Encerrado",
  // },
  // {
  //   id: "2",
  //   nome: "Inventário 002",
  //   criador: "Marjory",
  //   dataCriacao: Date.now(),
  //   status: "Suspenso",
  // },
  // {
  //   id: "3",
  //   nome: "Inventário 003",
  //   criador: "Marjory",
  //   dataCriacao: Date.now(),
  //   status: "Aberto",
  // },
  // {
  //   id: "4",
  //   nome: "Inventário 004",
  //   criador: "Marjory",
  //   dataCriacao: Date.now(),
  //   status: "Em andamento",
  // },
]);
const router = useRouter();
const colunas = reactive([
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

function editarInventario() {
  const id = inventarioSelecionado.value[0].id;
  useRouter("/");
}
onMounted(() => {
  axios
    .get(`${API_URL}v1/restrito/inventario`)
    .then((res) => {
      Object.assign(inventarios, res.data);
    })
    .catch(console.log);
});
</script>
