<template>
  <div class="q-pa-md">
    <!-- <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md"> -->
    <q-form class="q-gutter-md">
      <q-input
        outlined
        v-model="nome"
        label="Nome de usuário"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        type="e-mail"
        outlined
        v-model="email"
        label="E-mail (@ufjf.br)"
      />

      <q-table
        title="Inventários"
        :rows="inventarios"
        :columns="colunas"
        row-key="name"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        v-model:selected="selected"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>

      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </q-form>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import inventariosDb from "../../store/inventarios";

// onMounted(() => {
//   Object.assign(inventarios, inventariosDb);
// });

const selected = ref([]);
const nome = ref("");
const email = ref("");
const inventarios = ref([
  {
    id: "1",
    nome: "Inventário 001",
    criador: "Marjory",
    dataCriacao: Date.now(),
    status: "Encerrado",
  },
  {
    id: "2",
    nome: "Inventário 002",
    criador: "Marjory",
    dataCriacao: Date.now(),
    status: "Suspenso",
  },
  {
    id: "3",
    nome: "Inventário 003",
    criador: "Marjory",
    dataCriacao: Date.now(),
    status: "Aberto",
  },
  {
    id: "4",
    nome: "Inventário 004",
    criador: "Marjory",
    dataCriacao: Date.now(),
    status: "Em andamento",
  },
]);

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
    field: "status",
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
