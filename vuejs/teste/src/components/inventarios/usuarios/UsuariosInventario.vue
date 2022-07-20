<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify } from "quasar";
import { api } from "boot/axios";
import { registroPortugues } from "src/helper/functions";
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const idInventario = ref(null);
const novoUsuario = ref(null);
const usuariosSelecionados = ref([]);
const usuariosLista = ref([]);
const usuariosListaFiltro = ref([]);
const usuariosInventario = ref([]);
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

onMounted(() => {
  if ("idInventario" in route.params) {
    idInventario.value = +route.params.idInventario;

    api.get(`v1/restrito/usuarios`).then(async (usuariosResponse) => {
      usuariosLista.value = usuariosResponse.data;
      const usuariosInventarioResponse = await api.get(
        `v1/restrito/inventario/usuario/${idInventario.value}`
      );
      usuariosInventario.value = usuariosInventarioResponse.data;
    });
  }
});

function filterFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  update(() => {
    if (val === "") {
      novoUsuario.value = null;
      usuariosListaFiltro.value = usuariosLista.value;
    } else {
      const needle = val.toLowerCase();
      usuariosListaFiltro.value = usuariosLista.value.filter(
        (v) => v.nome.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function addUsuarioInventario() {
  const idUsuario = +novoUsuario.value.id;
  console.log(novoUsuario.value);
  const data = {
    idUsuario,
  };
  api
    .post(`v1/restrito/inventario/usuario/${idInventario.value}`, data)
    .then((res) => {
      Notify.create({
        color: "green",
        message: `Usuário ${novoUsuario.value} vinculado!`,
      });
      // router.go();
    })
    .catch((err) => {
      Notify.create({
        color: "red",
        message: `Erro ao vincular usuário: ${err}`,
      });
    });
  novoUsuario.value = null;
}

function deletarUsuario() {
  $q.dialog({
    title: "Desvinculação de usuário",
    message:
      "Tem certeza de que deseja desvincular o(s) usuário(s) do inventário?",
  }).onOk(() => {
    if (usuariosSelecionados.value.length > 0) {
      usuariosSelecionados.value.forEach((usuario) => {
        api
          .delete(
            `/v1/restrito/inventario/usuario/${idInventario.value}&${usuario.id}`
          )
          .then((_) => {
            Notify.create({
              color: "green",
              message: `Usuário ${usuario.nome} desvinculado!`,
            });
          })
          .catch((err) => {
            Notify.create({
              color: "red",
              message: `Erro ao desvincular usuário: ${err}`,
            });
          });
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
      <!-- <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="red"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="column">
              <q-toggle :model-value="true" label="Pode editar" />
              <q-toggle :model-value="false" label="Pode cadastrar items" />
              <q-toggle :model-value="true" label="Pode editar" />
            </div>
          </q-td>
        </q-tr>
      </template> -->
    </q-table>
    <q-btn
      color="primary"
      icon="check"
      label="Desvincular usuário(s) selecionado(s)"
      @click="deletarUsuario"
    />
  </div>
</template>
