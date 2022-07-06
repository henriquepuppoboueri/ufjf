<template>
  <q-card square>
    <q-card-section>
      <q-table
        flat
        title="Inventários"
        :rows="inventarios"
        :columns="colunas"
        row-key="id"
        selection="single"
        v-model:selected="inventarioSelecionado"
        :bordered="false"
      />
    </q-card-section>
    <q-card-actions>
      <q-btn
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        label="Visualizar"
        @click="verInventario"
      />
      <q-btn
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        label="Editar"
        @click="editarInventario"
      />
      <q-btn
        flat
        dense
        :disabled="!isEditavel"
        color="primary"
        label="Novo"
        @click="novoInventario"
      />
      <q-btn
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        label="Excluir"
        @click="editarInventario"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
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

const isEditavel = computed(() => {
  return !inventarioSelecionado.value.length > 0;
});

function verInventario() {
  const _id = inventarioSelecionado.value[0].id;
  // router.push(`view/${inventarioSelecionado.value[0].id}`);
  router.push(`/inventario/view/${inventarioSelecionado.value[0].id}`);
}

function editarInventario() {
  router.push(`/inventario/edit/${inventarioSelecionado.value[0].id}`);
}

function novoInventario() {
  router.push({ path: "novo" });
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
