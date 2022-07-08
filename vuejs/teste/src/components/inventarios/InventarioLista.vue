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
        v-if="!isEditavel"
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        label="Visualizar"
        @click="verInventario"
      />
      <q-btn
        v-if="!isEditavel"
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        label="Editar"
        @click="editarInventario"
      />
      <q-btn
        v-if="isEditavel"
        flat
        dense
        :disabled="!isEditavel"
        color="primary"
        label="Novo"
        @click="novoInventario"
      />
      <q-btn
        v-if="!isEditavel"
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        label="Excluir"
        @click="excluirInventario"
      />
      <q-btn
        v-if="!isEditavel"
        flat
        dense
        :disabled="isEditavel"
        color="primary"
        :label="statusInventarioBtn"
        @click="mudarSituacaoInventario"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Notify } from "quasar";
import { API_URL } from "../../helper/constants.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
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
const colunas = ref([
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
    field: (row) => row.situacaoInventario.nome,
  },
]);

const isEditavel = computed(() => {
  return !inventarioSelecionado.value.length > 0;
});

function verInventario() {
  const _id = inventarioSelecionado.value[0].id;
  router.push(`/inventario/view/${_id}`);
}

function editarInventario() {
  const _id = inventarioSelecionado.value[0].id;
  router.push(`/inventario/edit/${_id}`);
}

function novoInventario() {
  router.push({ path: "/inventario/novo" });
}

function excluirInventario() {
  const _id = inventarioSelecionado.value[0].id;
  $q.dialog({
    title: "Exclusão de inventário",
    message: "Tem certeza de que deseja excluir o inventário?",
  }).onOk(() => {
    axios
      .delete(`${API_URL}v1/restrito/inventario/${_id}`)
      .then((_) => {
        Notify.create({ color: "green", message: "Inventário excluído!" });
        router.go();
      })
      .catch((err) => {
        Notify.create({
          color: "red",
          message: `Erro ao excluir inventário: ${err}`,
        });
      });
  });
}

function mudarSituacaoInventario() {
  const situacaoAtual = inventarioSelecionado.value[0].situacaoInventario.nome;
  const _id = inventarioSelecionado.value[0].id;
  if (situacaoAtual === "Preparando") {
    axios
      .patch(`${API_URL}v1/restrito/inventario/liberar/${_id}`)
      .then((res) => {
        Notify.create({ color: "green", message: "Inventário liberado!" });
        router.go();
      })
      .catch((err) => {
        Notify.create({
          color: "red",
          message: `Erro ao liberar inventário: ${err}`,
        });
      });
  } else if (situacaoAtual === "Inventariando") {
    axios
      .patch(`${API_URL}v1/restrito/inventario/fechar/${_id}`)
      .then((res) => {
        Notify.create({ color: "green", message: "Inventário fechado!" });
      })
      .catch((err) => {
        Notify.create({
          color: "red",
          message: `Erro ao fechar inventário: ${err}`,
        });
      });
  }
}

const statusInventarioBtn = computed(() => {
  const situacaoAtual = inventarioSelecionado.value[0].situacaoInventario.nome;
  let lblTemp = "";
  switch (situacaoAtual) {
    case "Preparando":
      lblTemp = "Liberar";
      break;
    case "Inventariando":
      lblTemp = "Fechar";
      break;
  }
  return lblTemp;
});

onMounted(() => {
  axios
    .get(`${API_URL}v1/restrito/inventario`)
    .then((res) => {
      Object.assign(inventarios, res.data);
    })
    .catch(console.log);
});
</script>
