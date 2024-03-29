<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useQuasar } from "quasar";
import { useInventariosStore } from "src/stores/inventarios";
import { useUsuariosStore } from "src/stores/usuarios";
import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";
import { storeToRefs } from "pinia";

const mostrarDialog = ref(false);
const inventariosStore = useInventariosStore();
const usuariosStore = useUsuariosStore();
const { inventarios, carregando } = storeToRefs(inventariosStore);
const { buscarInventarios } = inventariosStore;
const { usuarioInventarios } = storeToRefs(usuariosStore);
const { buscarUsuarioInventarios } = usuariosStore;
const $q = useQuasar();
const inventarioSelecionado = ref([]);
const router = useRouter();
const colunas = ref([
  {
    name: "nome",
    align: "left",
    label: "NOME",
    field: "nome",
  },
  {
    name: "status",
    align: "left",
    label: "STATUS",
    field: (row) => row.situacaoInventario.nome,
  },
]);

const isEditavel = computed(() => {
  return !inventarioSelecionado.value.length > 0;
});

function verInventario() {
  const _id = inventarioSelecionado.value[0].id;
  router.push({ name: "resumoSetores", params: { idInventario: _id } });
}

function editarInventario() {
  const _id = inventarioSelecionado.value[0].id;
  router.push(`/inventario/edit/${_id}/`);
}

function novoInventario() {
  router.push({ path: "/inventario/novo/" });
}

async function excluirInventario() {
  const _id = inventarioSelecionado.value[0].id;

  try {
    const status = await inventariosStore.delInventario(_id);
    if (status === 204) {
      Notify.create({ color: "green", message: "Inventário excluído!" });
      inventarioSelecionado.value = [];
    }
  } catch (error) {
    Notify.create({
      color: "red",
      // message: `Erro ao excluir inventário: ${error.response.data}`,
      message: `Erro ao excluir inventário: ${error.message}`,
    });
  } finally {
    mostrarDialog.value = false;
    inventarioSelecionado.value = [];
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
    case "Fechado":
      lblTemp = "Reabrir";
      break;
  }
  return lblTemp;
});

onMounted(async () => {
  await usuariosStore.buscarUsuarioInventarios();
  const usuarioInventariosId = usuarioInventarios.value.map(
    (inventario) => inventario.idInventario
  );
  await buscarInventarios(usuarioInventariosId);
});

async function mudarSituacaoInventario() {
  const situacaoAtual = inventarioSelecionado.value[0].situacaoInventario.nome;
  const _id = inventarioSelecionado.value[0].id;
  if (situacaoAtual === "Preparando") {
    try {
      const status = await inventariosStore.liberarInventario(_id);
      Notify.create({ color: "green", message: "Inventário liberado!" });
    } catch (error) {
      Notify.create({
        color: "red",
        message: `Erro ao liberar inventário: ${error}`,
      });
    }
  } else if (situacaoAtual === "Inventariando") {
    try {
      const status = await inventariosStore.fecharInventario(_id);
      Notify.create({ color: "green", message: "Inventário fechado!" });
    } catch (error) {
      Notify.create({
        color: "red",
        message: `Erro ao fechar inventário: ${error}`,
      });
    }
  } else if (situacaoAtual === "Fechado") {
    $q.dialog({
      title: "Reabertura de inventário",
      message: "Função não implementada!",
    });
  }
}
</script>

<template>
  <q-dialog v-model="mostrarDialog">
    <q-card class="q-pa-sm">
      <q-card-section class="text-h6 text-center text-bold">
        Confirmação de exclusão
      </q-card-section>
      <q-card-section>
        <p class="text-center text-subtitle">
          Tem certeza de que desejar excluir o inventário selecionado?
        </p>
      </q-card-section>
      <q-card-actions class="flex-center q-gutter-md">
        <q-btn dense color="red" label="Não" @click="mostrarDialog = false" />
        <q-btn dense color="green" label="Sim" @click="excluirInventario" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-card flat>
    <q-card-section>
      <q-table
        v-model:selected="inventarioSelecionado"
        flat
        :loading="carregando"
        title="Inventários"
        :rows="inventarios"
        :columns="colunas"
        row-key="id"
        selection="single"
        :wrap-cells="true"
        :bordered="false"
        :selected-rows-label="registroPortugues"
        :pagination="paginacaoOpcoes"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
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
        @click="mostrarDialog = true"
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
  <q-separator inset />
</template>

<style lang="sass">

.q-card__section
  padding-bottom: 0

.q-btn
  min-width: 5rem
</style>
