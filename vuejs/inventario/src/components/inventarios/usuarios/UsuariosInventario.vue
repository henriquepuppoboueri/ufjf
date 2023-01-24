<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Notify } from "quasar";
import { registroPortugues } from "src/helper/functions";
import { useQuasar } from "quasar";
import { useUsuariosStore } from "stores/usuarios";
import { useInventariosStore } from "stores/inventarios";
import { storeToRefs } from "pinia";
import lodash from "lodash";

const inventariosStore = useInventariosStore();
const { usuariosInventario } = storeToRefs(inventariosStore);
const usuariosStore = useUsuariosStore();
const { usuarios } = storeToRefs(usuariosStore);
const $q = useQuasar();
const route = useRoute();
const idInventario = ref(null);
const novoUsuario = ref(null);
const usuariosSelecionados = ref([]);
const usuariosListaFiltro = ref([]);
const colunasTblUsuarios = ref([
  // {
  //   name: "id",
  //   align: "left",
  //   label: "ID",
  //   field: "id",
  //   sortable: true,
  // },
  {
    name: "login",
    required: true,
    label: "LOGIN",
    align: "left",
    // field: (row) => row.name,
    field: "login",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "nome",
    align: "left",
    label: "NOME",
    field: "nome",
    sortable: true,
  },
  {
    name: "email",
    align: "left",
    label: "E-MAIL",
    field: "email",
    sortable: true,
  },
  {
    name: "tipo",
    required: true,
    label: "ADMINISTRADOR",
    align: "left",
    field: "admin",
    format: (val) => `${val ? "Sim" : "Não"}`,
    sortable: true,
  },
]);

const presidente = computed(() => {
  const presidentes = usuariosInventario.value
    .filter((usuario) => usuario.presidente)
    .map((usuario2) => usuario2.nome);
  return presidentes.length > 0
    ? { temPresidente: true, value: presidentes }
    : {
        temPresidente: false,
        value: "Sem presidente. Selecionar na tabela abaixo.",
      };
});

function togglePresidenteInventario() {
  if (usuariosSelecionados.value.length > 0) {
    const usuario = usuariosSelecionados.value[0];

    // Usuário era presidente
    let tituloInicio = "Revogação de presidência";
    let mensagemInicio =
      "Tem certeza de que deseja revogar o status de presidente do usuário selecionado?";
    let mensagemSucesso = `Usuário ${usuario.nome} destituído como presidente!`;
    let mensagemErro = "";
    let api = inventariosStore.setUsuarioInventarioNormal;

    // Usuário não era presidente
    if (!usuario.presidente) {
      tituloInicio = "Definição de presidente";
      mensagemInicio =
        "Tem certeza de que deseja definir o usuário selecionado presidente do inventário?";
      mensagemSucesso = `Usuário ${usuario.nome} definido como presidente!`;
      mensagemErro = "";
      api = inventariosStore.setUsuarioInventarioPresidente;
    }

    mostrarDialog(
      tituloInicio,
      mensagemInicio,
      mensagemSucesso,
      mensagemErro,
      api,
      idInventario,
      usuario.id
    );
  }
}

function toggleAdminInventario() {
  if (usuariosSelecionados.value.length > 0) {
    const usuario = usuariosSelecionados.value[0];

    // Usuário era presidente
    let tituloInicio = "Revogação de administrador";
    let mensagemInicio =
      "Tem certeza de que deseja revogar o status de administrador do usuário selecionado?";
    let mensagemSucesso = `Usuário ${usuario.nome} revogado como administrador!`;
    let mensagemErro = "";
    let api = inventariosStore.setUsuarioInventarioNaoAdmin;

    // Usuário não era administrador
    if (!usuario.admin) {
      tituloInicio = "Definição de administrador";
      mensagemInicio =
        "Tem certeza de que deseja definir o usuário selecionado administrador do inventário?";
      mensagemSucesso = `Usuário ${usuario.nome} definido como administrador!`;
      mensagemErro = "";
      api = inventariosStore.setUsuarioInventarioAdmin;
    }

    mostrarDialog(
      tituloInicio,
      mensagemInicio,
      mensagemSucesso,
      mensagemErro,
      api,
      idInventario,
      usuario.id
    );
  }
}

function mostrarDialog(
  tituloInicio,
  mensagemInicio,
  mensagemSucesso,
  mensagemErro,
  api,
  idInventario,
  idUsuario
) {
  $q.dialog({
    title: `${tituloInicio}`,
    message: `${mensagemInicio}`,
    cancel: { type: "button", label: "Cancelar", color: "primary" },
    ok: { type: "button", label: "Confirmar", color: "green" },
  }).onOk(async () => {
    try {
      await api(idInventario.value, idUsuario);
      Notify.create({
        color: "green",
        message: `${mensagemSucesso}`,
      });
    } catch (err) {
      console.log(err);
      Notify.create({
        color: "red",
        message: ` ${err.response.data}`,
      });
    } finally {
      novoUsuario.value = null;
      usuariosSelecionados.value = [];
    }
  });
}

const usuariosSemVinculo = computed(() => {
  return lodash.differenceBy(usuarios.value, usuariosInventario.value, "id");
});

onMounted(async () => {
  if ("idInventario" in route.params) {
    idInventario.value = +route.params.idInventario;

    await usuariosStore.buscarUsuarios();
    await inventariosStore.buscarUsuariosInventario(idInventario.value);
  }
});

function filterFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  update(() => {
    if (val === "") {
      novoUsuario.value = null;
      usuariosListaFiltro.value = usuariosSemVinculo.value;
    } else {
      const needle = val.toLowerCase();
      usuariosListaFiltro.value = usuariosSemVinculo.value.filter(
        (v) => v.nome.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

async function addUsuarioInventario() {
  const idUsuario = novoUsuario.value.id;
  const data = {
    idUsuario,
  };

  try {
    await inventariosStore.addUsuarioInventario(
      idInventario.value,
      data,
      novoUsuario.value
    );
    Notify.create({
      color: "green",
      message: `Usuário ${novoUsuario.value.nome} vinculado!`,
    });
  } catch (err) {
    Notify.create({
      color: "red",
      message: `Erro ao vincular usuário: ${err}`,
    });
  } finally {
    novoUsuario.value = null;
  }
}

async function deletarUsuario() {
  $q.dialog({
    title: "Desvinculação de usuário",
    message:
      "Tem certeza de que deseja desvincular o(s) usuário(s) do inventário?",
    cancel: { type: "button", label: "Cancelar", color: "primary" },
    ok: { type: "button", label: "Confirmar", color: "green" },
  }).onOk(() => {
    if (usuariosSelecionados.value.length > 0) {
      usuariosSelecionados.value.forEach(async (usuario) => {
        try {
          await inventariosStore.delUsuarioInventario(
            idInventario.value,
            usuario.id
          );
          Notify.create({
            color: "green",
            message: `Usuário ${usuario.nome} desvinculado!`,
          });
        } catch (err) {
          Notify.create({
            color: "red",
            message: `Erro ao desvincular usuário: ${err}`,
          });
        } finally {
          novoUsuario.value = null;
          usuariosSelecionados.value = [];
        }
      });
    }
  });
}
</script>

<template>
  <div class="col permissoes q-gutter-y-sm q-pa-sm">
    <q-input
      outlined
      type="text"
      label="Presidente"
      :model-value="presidente.value"
      disable
      :bg-color="presidente.temPresidente ? 'green-2' : 'red-2'"
    />
    <q-separator spaced />
    <div class="row q-gutter-x-sm justify-between no-wrap">
      <q-select
        class="fit"
        outlined
        v-model="novoUsuario"
        use-input
        hide-selected
        fill-input
        input-debounce="300"
        label="Adicionar usuário"
        :options="usuariosListaFiltro"
        :option-label="(row) => row.nome"
        @filter="filterFn"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultado. </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-btn
        :disable="!novoUsuario"
        outline
        icon="add"
        color="green"
        @click="addUsuarioInventario"
      />
    </div>
    <q-table
      flat
      bordered
      title="Usuários e permissões"
      v-model:selected="usuariosSelecionados"
      :rows="usuariosInventario"
      :columns="colunasTblUsuarios"
      row-key="id"
      selection="multiple"
      no-data-label="Não foram encontrados dados."
      rows-per-page-label="Registros por página:"
      :selected-rows-label="registroPortugues"
    >
    </q-table>
    <div class="row q-gutter-x-sm" v-if="usuariosSelecionados.length > 0">
      <q-btn
        v-if="usuariosSelecionados.length > 0"
        color="primary"
        label="Desvincular"
        @click="deletarUsuario"
        :disable="!usuariosSelecionados.length > 0"
      />
      <q-btn
        v-if="usuariosSelecionados.length === 1"
        color="green"
        :label="`${
          usuariosSelecionados[0].admin
            ? 'Revogar administrador'
            : 'Definir como administrador'
        }`"
        @click="toggleAdminInventario"
        :disable="!usuariosSelecionados.length === 1"
      />
      <q-btn
        v-if="usuariosSelecionados.length === 1"
        color="blue"
        :label="`${
          usuariosSelecionados[0].presidente
            ? 'Revogar presidência'
            : 'Definir como presidente'
        }`"
        @click="togglePresidenteInventario"
        :disable="!usuariosSelecionados.length === 1"
      />
    </div>
  </div>
</template>

<style lang="sass">
.q-field--outlined
  border-color: red

.q-dialog-plugin
  padding: 0.5rem

.q-card__actions
  // padding-bottom: 0

.q-dialog__title
  text-align: center

.q-dialog__message
  text-align: justify
</style>
