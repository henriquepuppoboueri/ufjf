<template>
  <div class="q-pa-md">
    <!-- <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md"> -->
    <q-form class="q-gutter-md">
      <q-input outlined v-model="nome" label="Nome de usuário" />

      <q-input
        type="e-mail"
        outlined
        v-model="email"
        label="E-mail (@ufjf.br)"
      />

      <q-table
        title="Inventários vinculados"
        :rows="inventarios"
        :columns="colunas"
        row-key="name"
      />
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
import { ref } from "vue";

// onMounted(() => {
//   Object.assign(inventarios, inventariosDb);
// });

const selected = ref([]);
const nome = ref("");
const email = ref("");
const inventarios = ref([]);

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
</script>
