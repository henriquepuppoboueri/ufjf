<template>
  <q-card flat>
    <q-card-section>
      <q-table
        v-model:selected="usuarioSelecionado"
        flat
        title="Usuários"
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        selection="single"
        :pagination="paginacaoOpcoes"
        :bordered="false"
        :selected-rows-label="registroPortugues"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
      />
    </q-card-section>
    <q-card-actions>
      <q-btn
        v-if="!isUsuarioSelecionado"
        dense
        color="green"
        label="Novo"
        :to="`/usuario/novo`"
      />
      <q-btn
        v-if="isUsuarioSelecionado"
        dense
        color="blue"
        label="Editar"
        :to="`/usuario/${idUsuario}`"
      />
      <q-btn
        v-if="isUsuarioSelecionado"
        dense
        color="primary"
        label="Excluir"
        @click="excluirUsuario"
      />
    </q-card-actions>
  </q-card>
  <q-separator inset />
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

import { Notify, useQuasar } from "quasar";
import { storeToRefs } from "pinia";

import { registroPortugues } from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";
import { useUsuariosStore } from "src/stores/usuarios";

const $q = useQuasar();
const usuariosStore = useUsuariosStore();
const { usuarios } = storeToRefs(usuariosStore);
const isUsuarioSelecionado = computed(() => {
  return usuarioSelecionado.value.length > 0;
});
const idUsuario = computed(() => {
  return usuarioSelecionado.value[0].id || 0;
});
const usuarioSelecionado = ref([]);
const colunas = ref([
  {
    name: "nome",
    align: "left",
    label: "NOME",
    field: "nome",
  },
  {
    name: "email",
    align: "left",
    label: "E-MAIL",
    // field: (row) => row.situacaoInventario.nome,
    field: "email",
  },
  // {
  //   name: "id",
  //   align: "left",
  //   label: "id",
  //   // field: (row) => row.situacaoInventario.nome,
  //   field: "id",
  // },
]);

onMounted(async () => {
  try {
    await usuariosStore.buscarUsuarios();
  } catch (error) {}
});

async function excluirUsuario() {
  $q.dialog({
    title: `Confirmação de exclusão de usuário`,
    message: `Tem certeza de que deseja excluir o usuário '${usuarioSelecionado.value[0].nome}'?`,
    cancel: { type: "button", label: "Cancelar", color: "primary" },
    ok: { type: "button", label: "Confirmar", color: "green" },
  }).onOk(async () => {
    try {
      const response = await usuariosStore.delUsuario(idUsuario.value);
      const usuarioTemp = usuarioSelecionado.value[0];
      if (response && response.status === 204) {
        Notify.create({
          color: "green",
          message: `Usuário '${usuarioTemp.nome}' excluído!`,
        });
      } else {
        throw new Error(
          `Não foi possível excluir o usuário '${usuarioTemp.nome}'`
        );
      }
    } catch (err) {
      Notify.create({
        color: "red",
        message: ` ${err}`,
      });
    } finally {
      usuarioSelecionado.value = [];
    }
  });
}
</script>

<style lang="sass">

.q-card__section
  padding-bottom: 0

.q-btn
  min-width: 5rem
</style>
