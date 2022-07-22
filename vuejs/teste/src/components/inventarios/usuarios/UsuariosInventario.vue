<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify } from "quasar";
import { api } from "boot/axios";
import { registroPortugues } from "src/helper/functions";
import { useQuasar } from "quasar";
import { useUsuariosStore } from "stores/usuarios";
import { useInventariosStore } from "stores/inventarios";
import { MutationType, storeToRefs } from "pinia";

const inventariosStore = useInventariosStore();
const { usuariosInventario } = storeToRefs(inventariosStore);
const usuariosStore = useUsuariosStore();
const { usuarios } = storeToRefs(usuariosStore);
// const usuariosLista = ref([]);
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const idInventario = ref(null);
const novoUsuario = ref(null);
const usuariosSelecionados = ref([]);
const usuariosListaFiltro = ref([]);
// const usuariosInventario = ref([]);
const colunasTblUsuarios = ref([
  {
    name: "login",
    required: true,
    label: "Login",
    align: "left",
    // field: (row) => row.name,
    field: "login",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "nome",
    align: "left",
    label: "Nome",
    field: "nome",
    sortable: true,
  },
  {
    name: "email",
    align: "left",
    label: "E-mail",
    field: "email",
    sortable: true,
  },
]);

// inventariosStore.$subscribe((mutation, state) => {
//   console.log(mutation);
// });

onMounted(async () => {
  if ("idInventario" in route.params) {
    idInventario.value = +route.params.idInventario;

    await usuariosStore.buscarUsuarios();
    // usuariosLista.value = usuariosStore.usuarios;
    await inventariosStore.buscarUsuariosInventario(idInventario.value);
    // usuariosInventario.value = inventariosStore.usuariosInventario;
  }
});

function filterFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  update(() => {
    if (val === "") {
      novoUsuario.value = null;
      usuariosListaFiltro.value = usuarios.value;
    } else {
      const needle = val.toLowerCase();
      usuariosListaFiltro.value = usuarios.value.filter(
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

function deletarUsuario() {
  $q.dialog({
    title: "Desvinculação de usuário",
    message:
      "Tem certeza de que deseja desvincular o(s) usuário(s) do inventário?",
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
        }
      });
    }
  });
}
</script>

<template>
  <div class="col permissoes q-gutter-y-sm q-pa-sm">
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
    <q-btn
      v-if="usuariosSelecionados.length > 0"
      color="primary"
      label="Desvincular"
      @click="deletarUsuario"
      :disable="!usuariosSelecionados.length > 0"
    />
  </div>
</template>
