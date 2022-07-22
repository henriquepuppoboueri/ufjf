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
        dense
        :disabled="isEditavel"
        color="orange"
        class="text-white"
        label="Visualizar"
        @click="verInventario"
      />
      <q-btn
        v-if="!isEditavel"
        dense
        :disabled="isEditavel"
        color="blue"
        label="Editar"
        @click="editarInventario"
      />
      <q-btn
        v-if="!isEditavel"
        dense
        :disabled="isEditavel"
        color="primary"
        label="Excluir"
        @click="excluirInventario"
      />
      <q-btn
        v-if="isEditavel"
        dense
        :disabled="!isEditavel"
        color="green"
        label="Novo"
        @click="novoInventario"
      />
      <q-btn
        v-if="!isEditavel"
        dense
        :disabled="isEditavel"
        color="green"
        :label="statusInventarioBtn"
        @click="mudarSituacaoInventario"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { Notify } from "quasar";
import { useQuasar } from "quasar";
import { useInventariosStore } from "src/stores/inventarios";

const inventariosStore = useInventariosStore();
const $q = useQuasar();
const inventarioSelecionado = ref([]);
const inventarios = ref([]);
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

// inventariosStore.$subscribe(
//   (mutation, state) => {
//     console.log(mutation);
//   },
//   { detached: true }
// );

const isEditavel = computed(() => {
  return !inventarioSelecionado.value.length > 0;
});

function verInventario() {
  const _id = inventarioSelecionado.value[0].id;
  router.push(`/inventario/view/${_id}/`);
}

function editarInventario() {
  const _id = inventarioSelecionado.value[0].id;
  router.push(`/inventario/edit/${_id}/`);
}

function novoInventario() {
  router.push({ path: "/inventario/novo/" });
}

function excluirInventario() {
  const _id = inventarioSelecionado.value[0].id;
  $q.dialog({
    title: "Exclusão de inventário",
    message: "Tem certeza de que deseja excluir o inventário?",
  }).onOk(async () => {
    const status = await inventariosStore.delInventario(_id);
    if (status === 204) {
      Notify.create({ color: "green", message: "Inventário excluído!" });
      router.go();
    }
  });
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

onMounted(async () => {
  inventarios.value = await inventariosStore.buscarInventarios();
  // inventarios.value = inventariosStore.inventarios;
  // api
  //   .get(`v1/restrito/inventario`)
  //   .then((res) => {
  //     Object.assign(inventarios, res.data);
  //   })
  //   .catch(console.log);
});

function mudarSituacaoInventario() {
  const situacaoAtual = inventarioSelecionado.value[0].situacaoInventario.nome;
  const _id = inventarioSelecionado.value[0].id;
  if (situacaoAtual === "Preparando") {
    api
      .patch(`v1/restrito/inventario/liberar/${_id}`)
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
    api
      .patch(`v1/restrito/inventario/fechar/${_id}`)
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
</script>
