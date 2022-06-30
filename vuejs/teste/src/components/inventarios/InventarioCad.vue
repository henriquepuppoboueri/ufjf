<template>
  <div class="q-pa-md">
    <!-- <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md"> -->
    <q-form class="q-gutter-md">
      <q-input outlined v-model="nomeInventario" label="Nome do inventário" />

      <q-select
        outlined
        v-model="statusAtual"
        :options="statusOpcoes"
        label="Status do inventário"
      />
      <q-input
        readonly
        outlined
        v-model="dataCriacao"
        mask="##/##/####"
        label="Data de criação"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date readonly v-model="dataCriacao" mask="yyyy-MM-dd">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-editor v-model="inventarioDescricao" min-height="5rem" />

      <!-- <q-table
        title="Usuários e permissões"
        :rows="inventarios"
        :columns="colunas"
        row-key="name"
        :selected-rows-label="getSelectedString"
        v-model:selected="selected"
      /> -->

      <q-btn
        outline
        dense
        @click="mostrarTblPermissoes = !mostrarTblPermissoes"
      >
        {{ mostrarTblPermissoes ? "Ocultar" : "Mostrar" }} usuários e
        permissões</q-btn
      >
      <q-table
        v-if="mostrarTblPermissoes"
        title="Usuários e permissões"
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
      >
        <template v-slot:header="props">
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
        </template>
      </q-table>
      <div>
        <q-btn label="Enviar" type="submit" color="primary" />
        <q-btn
          label="Limpar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive } from "vue";
import inventariosDb from "../../store/inventarios";

onBeforeMount(() => {
  // Object.assign(inventarios, inventariosDb);
});

const mostrarTblPermissoes = ref(true);
const dataCriacao = ref("30/06/2022");
const selected = reactive([]);
const inventarioDescricao = ref(
  "Este é um <strong>teste</strong> <br> de descrição"
);
const statusAtual = ref("");
const statusOpcoes = reactive([
  "Aberto",
  "Em andamento",
  "Suspenso",
  "Encerrado",
]);
const name = ref("");
const age = ref("");
const nomeInventario = ref("");
const usuarios = ref([
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
]);
const colunas = ref([
  {
    name: "usuario",
    required: true,
    label: "Usuário",
    align: "left",
    // field: (row) => row.name,
    field: "usuario",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "siape",
    align: "left",
    label: "SIAPE",
    field: "siape",
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

const getSelectedString = () => {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${
        selected.value.length > 1 ? "s" : ""
      } selected of ${rows.length}`;
};
</script>
