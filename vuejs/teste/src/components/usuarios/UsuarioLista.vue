<template>
  <q-card square>
    <q-card-section>
      <q-table
        title="Usuários"
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        selection="single"
        v-model:selected="usuarioSelecionado"
        :bordered="false"
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
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";

const isUsuarioSelecionado = computed(() => {
  return usuarioSelecionado.value.length > 0;
});
const idUsuario = computed(() => {
  return usuarioSelecionado.value[0].id || 0;
});
const usuarioSelecionado = ref([]);
const usuarios = reactive([]);
const colunas = ref([
  {
    name: "nome",
    align: "left",
    label: "Nome",
    field: "nome",
  },
  {
    name: "email",
    align: "left",
    label: "E-mail",
    // field: (row) => row.situacaoInventario.nome,
    field: "email",
  },
]);

onMounted(() => {
  api
    .get("v1/restrito/usuarios")
    .then((res) => {
      Object.assign(usuarios, res.data);
    })
    .catch(console.log);
});

function excluirUsuario() {}
</script>
