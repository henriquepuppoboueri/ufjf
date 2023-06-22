<script setup>
import { Notify, useQuasar } from 'quasar';

import { registroPortugues } from '/helper/functions';
import { paginacaoOpcoes } from '/helper/qtableOpcoes';

const $q = useQuasar();
const usuariosStore = useUsuariosStore();
const { usuarios } = storeToRefs(usuariosStore);
const { buscarUsuarios } = usuariosStore;
const isUsuarioSelecionado = computed(() => {
  return usuarioSelecionado.value.length > 0;
});
const idUsuario = computed(() => {
  return usuarioSelecionado.value[0].id || 0;
});
const usuarioSelecionado = ref([]);
const filtro = ref('');
const colunas = ref([
  {
    name: 'nome',
    align: 'left',
    label: 'NOME',
    field: 'nome',
  },
  {
    name: 'email',
    align: 'left',
    label: 'E-MAIL',
    field: 'email',
  },
]);

onMounted(async () => {
  try {
    await buscarUsuarios();
  } catch (error) {}
});

async function excluirUsuario() {
  $q.dialog({
    title: `Confirmação de exclusão de usuário`,
    message: `Tem certeza de que deseja excluir o usuário '${usuarioSelecionado.value[0].nome}'?`,
    cancel: { type: 'button', label: 'Cancelar', color: 'primary' },
    ok: { type: 'button', label: 'Confirmar', color: 'green' },
  }).onOk(async () => {
    try {
      await usuariosStore.delUsuario(idUsuario.value);
    } catch (err) {
      Notify.create({
        color: 'red',
        message: ` ${err}`,
      });
    } finally {
      usuarioSelecionado.value = [];
    }
  });
}
</script>

<template>
  <q-card flat>
    <q-card-section>
      <q-table
        v-model:selected="usuarioSelecionado"
        flat
        :filter="filtro"
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
      >
        <template #top-right>
          <div class="row q-gutter-sm">
            <q-input
              v-model="filtro"
              borderless
              dense
              filled
              debounce="300"
              placeholder="Filtrar"
              clearable
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions>
      <q-btn
        v-if="!isUsuarioSelecionado"
        dense
        color="green"
        label="Novo"
        :to="`/usuario/adicionar`"
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

<style lang="sass">

.q-card__section
  padding-bottom: 0

.q-btn
  min-width: 5rem
</style>
