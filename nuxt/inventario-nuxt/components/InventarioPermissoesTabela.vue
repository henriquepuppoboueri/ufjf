<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Notify } from 'quasar';
import { registroPortugues } from '/helper/functions';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';

const inventariosStore = useInventariosStore();
const { usuariosInventario } = storeToRefs(inventariosStore);
const { setUsuarioEmitenteRel, setUsuarioNaoEmitenteRel } = inventariosStore;
const usuariosStore = useUsuariosStore();
const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);
const $q = useQuasar();
const route = useRoute();
const idInventario = ref(null);

const usuariosSelecionados = ref([]);
const colunasTblUsuarios = ref([
  {
    name: 'login',
    required: true,
    label: 'LOGIN',
    align: 'left',
    // field: (row) => row.name,
    field: 'login',
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'nome',
    align: 'left',
    label: 'NOME',
    field: 'nome',
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'E-MAIL',
    field: 'email',
    sortable: true,
  },
  {
    name: 'tipo',
    required: true,
    label: 'ADMINISTRADOR',
    align: 'left',
    field: 'admin',
    format: (val) => `${val ? 'Sim' : 'Não'}`,
    sortable: true,
  },
  {
    name: 'permissoes',
    required: true,
    label: 'PERMISSÕES',
    align: 'left',
    field: 'permissoes',
    sortable: false,
  },
]);

const PRESIDENTE_OPTIONS = {
  title: 'Revogação de presidência',
  message:
    'Tem certeza de que deseja revogar o status de presidente do usuário selecionado?',
  async cbTry() {
    if (usuariosSelecionados.value.length > 0) {
      const usuario = usuariosSelecionados.value[0];

      await inventariosStore.setUsuarioInventarioNormal(
        idInventario.value,
        usuario.id
      );
    }
  },
  errorMsg: `Erro ao remover presidência do usuário!`,
  successMsg: `Revogação de presidência bem-sucedida!`,
  cbFinally() {
    usuariosSelecionados.value = [];
  },
};

const NAO_PRESIDENTE_OPTIONS = {
  title: 'Definição de presidência',
  message:
    'Tem certeza de que deseja definir como presidente o usuário selecionado?',
  async cbTry() {
    if (usuariosSelecionados.value.length > 0) {
      const usuario = usuariosSelecionados.value[0];

      await inventariosStore.setUsuarioInventarioPresidente(
        idInventario.value,
        usuario.id
      );
    }
  },
  errorMsg: `Erro ao definir usuário como presidente!`,
  successMsg: `Revogação de presidência mal-sucedida!`,
  cbFinally() {
    usuariosSelecionados.value = [];
  },
};

const ADMIN_OPTIONS = {
  title: 'Revogação de administrador',
  message:
    'Tem certeza de que deseja revogar o status de administrador do usuário selecionado?',
  async cbTry() {
    if (usuariosSelecionados.value.length > 0) {
      const usuario = usuariosSelecionados.value[0];

      await inventariosStore.setUsuarioInventarioNaoAdmin(
        idInventario.value,
        usuario.id
      );
    }
  },
  errorMsg: `Erro ao revogar status de administrador do usuário!`,
  successMsg: `Usuário revogado como administrador!`,
  cbFinally() {
    usuariosSelecionados.value = [];
  },
};

const NAO_ADMIN_OPTIONS = {
  title: 'Definição de administrador',
  message:
    'Tem certeza de que deseja definir o usuário selecionado administrador do inventário?',
  async cbTry() {
    if (usuariosSelecionados.value.length > 0) {
      const usuario = usuariosSelecionados.value[0];

      await inventariosStore.setUsuarioInventarioAdmin(
        idInventario.value,
        usuario.id
      );
    }
  },
  errorMsg: `Erro ao definir usuário como administrador do usuário!`,
  successMsg: `Usuário definido como administrador!`,
  cbFinally() {
    usuariosSelecionados.value = [];
  },
};

function togglePresidenteInventario() {
  if (usuariosSelecionados.value[0].presidente) {
    novoDialog({
      title: PRESIDENTE_OPTIONS.title,
      message: PRESIDENTE_OPTIONS.message,
      cbTry: PRESIDENTE_OPTIONS.cbTry,
      successMsg: PRESIDENTE_OPTIONS.successMsg,
      errorMsg: PRESIDENTE_OPTIONS.errorMsg,
      cbFinally: PRESIDENTE_OPTIONS.cbFinally,
    });
  } else {
    novoDialog({
      title: NAO_PRESIDENTE_OPTIONS.title,
      message: NAO_PRESIDENTE_OPTIONS.message,
      cbTry: NAO_PRESIDENTE_OPTIONS.cbTry,
      successMsg: NAO_PRESIDENTE_OPTIONS.successMsg,
      errorMsg: NAO_PRESIDENTE_OPTIONS.errorMsg,
      cbFinally: NAO_PRESIDENTE_OPTIONS.cbFinally,
    });
  }
}

function toggleAdminInventario() {
  if (usuariosSelecionados.value[0].admin) {
    novoDialog({
      title: ADMIN_OPTIONS.title,
      message: ADMIN_OPTIONS.message,
      cbTry: ADMIN_OPTIONS.cbTry,
      errorMsg: ADMIN_OPTIONS.errorMsg,
      successMsg: ADMIN_OPTIONS.successMsg,
      cbFinally: ADMIN_OPTIONS.cbFinally,
    });
  } else {
    novoDialog({
      title: NAO_ADMIN_OPTIONS.title,
      message: NAO_ADMIN_OPTIONS.message,
      cbTry: NAO_ADMIN_OPTIONS.cbTry,
      errorMsg: NAO_ADMIN_OPTIONS.errorMsg,
      successMsg: NAO_ADMIN_OPTIONS.successMsg,
      cbFinally: NAO_ADMIN_OPTIONS.cbFinally,
    });
  }
}

const isUsuarioLogadoAdminInventario = computed(() => {
  return usuariosInventario.value
    .filter((usuario) => usuario.admin)
    .map((usuarioAdmin) => usuarioAdmin.id)
    .includes(usuario.value.id);
});

const setUsuarioPermissoes = async (user) => {
  if (!user.emitenteRel) {
    await setUsuarioNaoEmitenteRel(idInventario.value, user.id);
  } else {
    await setUsuarioEmitenteRel(idInventario.value, user.id);
  }
};

onMounted(async () => {
  if ('idInventario' in route.params) {
    idInventario.value = +route.params.idInventario;

    await usuariosStore.buscarUsuarios();
    await inventariosStore.buscarUsuariosInventario(idInventario.value);
  }
});

function novoDialog({
  title,
  message,
  cbTry,
  errorMsg,
  successMsg,
  cbFinally,
} = {}) {
  $q.dialog({
    title,
    message,
    cancel: { type: 'button', label: 'Cancelar', color: 'primary' },
    ok: { type: 'button', label: 'Confirmar', color: 'green' },
  }).onOk(async () => {
    try {
      await cbTry();
      if (successMsg)
        Notify.create({
          color: 'green',
          message: successMsg,
        });
    } catch (err) {
      Notify.create({
        color: 'red',
        message: `Erro: ${errorMsg || err}`,
      });
    } finally {
      cbFinally();
    }
  });
}

const DELETE_OPTIONS = {
  title: 'Desvinculação de usuário',
  message:
    'Tem certeza de que deseja desvincular o(s) usuário(s) do inventário?',
  async cbTry() {
    if (usuariosSelecionados.value.length > 0)
      usuariosSelecionados.value.forEach(async (usuario) => {
        await inventariosStore.delUsuarioInventario(
          idInventario.value,
          usuario.id
        );
      });
  },
  errorMsg: `Erro ao desvincular usuário!`,
  successMsg: `Usuário desvinculado!`,
  cbFinally() {
    usuariosSelecionados.value = [];
  },
};

async function deletarUsuario() {
  novoDialog({
    title: DELETE_OPTIONS.title,
    message: DELETE_OPTIONS.message,
    cbTry: DELETE_OPTIONS.cbTry,
    errorMsg: DELETE_OPTIONS.errorMsg,
    successMsg: DELETE_OPTIONS.successMsg,
    cbFinally: DELETE_OPTIONS.cbFinally,
  });
}
</script>

<template>
  <q-table
    v-model:selected="usuariosSelecionados"
    flat
    bordered
    title="Usuários e permissões"
    :rows="usuariosInventario"
    :columns="colunasTblUsuarios"
    row-key="id"
    selection="multiple"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
  >
    <template #body-cell-permissoes="props">
      <q-td :props="props">
        <q-btn
          color="white"
          text-color="black"
          icon="fa-solid fa-bars"
          :disabled="!isUsuarioLogadoAdminInventario"
        >
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6">Permissões</div>
                <q-separator spaced />
                <q-toggle
                  v-model="props.row.emitenteRel"
                  label="Emitir relatórios"
                  @click="setUsuarioPermissoes(props.row)"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-td>
    </template>
  </q-table>
  <div v-if="usuariosSelecionados.length > 0" class="row q-gutter-x-sm">
    <q-btn
      v-if="usuariosSelecionados.length > 0"
      color="primary"
      label="Desvincular"
      :disable="!usuariosSelecionados.length > 0"
      @click="deletarUsuario"
    />
    <q-btn
      v-if="usuariosSelecionados.length === 1"
      color="green"
      :label="`${
        usuariosSelecionados[0].admin
          ? 'Revogar administrador'
          : 'Definir como administrador'
      }`"
      :disable="!usuariosSelecionados.length === 1"
      @click="toggleAdminInventario(usuariosSelecionados[0].admin)"
    />
    <q-btn
      v-if="usuariosSelecionados.length === 1"
      color="blue"
      :label="`${
        usuariosSelecionados[0].presidente
          ? 'Revogar presidência'
          : 'Definir como presidente'
      }`"
      :disable="!usuariosSelecionados.length === 1"
      @click="togglePresidenteInventario"
    />
  </div>
</template>

<style scoped></style>
