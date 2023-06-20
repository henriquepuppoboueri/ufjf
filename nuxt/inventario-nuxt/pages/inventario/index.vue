<script setup>
import { Notify, useQuasar } from 'quasar';

import { registroPortugues } from '/helper/functions';
import { paginacaoOpcoes } from '/helper/qtableOpcoes';

definePageMeta({ name: 'inventario' });

const mostrarDialog = ref(false);

const inventariosStore = useInventariosStore();
const { inventarios, carregando, erro } = storeToRefs(inventariosStore);
const { buscarInventarios, delInventario, buscarUsuariosInventario } =
  inventariosStore;

const usuariosStore = useUsuariosStore();
const { usuarioInventarios } = storeToRefs(usuariosStore);
const { buscarUsuarioInventarios } = usuariosStore;

const $q = useQuasar();
const inventarioSelecionado = ref([]);
const colunas = ref([
  {
    name: 'nome',
    align: 'left',
    label: 'NOME',
    field: 'nome',
  },
  {
    name: 'status',
    align: 'left',
    label: 'STATUS',
    field: (row) => row.situacaoInventario.nome,
  },
]);

const isInvSelecionado = computed(() => {
  return !inventarioSelecionado.value.length > 0;
});

async function excluirInventario() {
  const _id = inventarioSelecionado.value[0].id;

  try {
    const { status } = await delInventario(_id);
    if (status === 204) {
      Notify.create({ color: 'green', message: 'Inventário excluído!' });
      inventarioSelecionado.value = [];
    }
  } catch (error) {
    Notify.create({
      color: 'red',
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
  let lblTemp = '';
  switch (situacaoAtual) {
    case 'Preparando':
      lblTemp = 'Liberar';
      break;
    case 'Inventariando':
      lblTemp = 'Fechar';
      break;
    case 'Fechado':
      lblTemp = 'Reabrir';
      break;
  }
  return lblTemp;
});

onBeforeMount(async () => {
  await buscarUsuarioInventarios();
  const usuarioInventariosId = usuarioInventarios.value.map(
    (inventario) => inventario.idInventario
  );
  await buscarInventarios(usuarioInventariosId);
});

async function mudarSituacaoInventario() {
  const situacaoAtual = inventarioSelecionado.value[0].situacaoInventario.nome;
  const _id = inventarioSelecionado.value[0].id;
  if (situacaoAtual === 'Preparando') {
    try {
      const status = await inventariosStore.liberarInventario(_id);
      Notify.create({ color: 'green', message: 'Inventário liberado!' });
    } catch (error) {
      Notify.create({
        color: 'red',
        message: `Erro ao liberar inventário: ${error}`,
      });
    }
  } else if (situacaoAtual === 'Inventariando') {
    try {
      const status = await inventariosStore.fecharInventario(_id);
      Notify.create({ color: 'green', message: 'Inventário fechado!' });
    } catch (error) {
      Notify.create({
        color: 'red',
        message: `Erro ao fechar inventário: ${error}`,
      });
    }
  } else if (situacaoAtual === 'Fechado') {
    $q.dialog({
      title: 'Reabertura de inventário',
      message: 'Função não implementada!',
    });
  }
}
</script>

<template>
  {{ inventariosStore.erro }}
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
        v-if="!isInvSelecionado"
        dense
        color="orange"
        class="text-white"
        label="Visualizar"
        :to="{
          path: `/inventario/${inventarioSelecionado[0].id}`,
        }"
      />
      <q-btn
        v-if="!isInvSelecionado"
        dense
        color="blue"
        label="Editar"
        :to="{
          path: `/inventario/editar/${inventarioSelecionado[0].id}`,
        }"
      />
      <q-btn
        v-if="!isInvSelecionado"
        dense
        color="primary"
        label="Excluir"
        @click="mostrarDialog = true"
      />
      <q-btn
        v-if="isInvSelecionado"
        dense
        color="green"
        label="Novo"
        to="/inventario/adicionar"
      />
      <q-btn
        v-if="!isInvSelecionado"
        dense
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
