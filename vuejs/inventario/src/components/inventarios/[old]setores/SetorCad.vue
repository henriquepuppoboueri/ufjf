<template>
  <div class="q-pa-md">
    <!-- <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md"> -->
    <q-form class="q-gutter-md">
      <q-input outlined v-model="name" label="Nome da unidade" />

      <q-editor v-model="unidadeDescricao" min-height="5rem" />
      <q-btn
        outline
        dense
        @click="mostrarTblDependencias = !mostrarTblDependencias"
      >
        {{ mostrarTblDependencias ? "Ocultar" : "Mostrar" }} dependências</q-btn
      >
      <div v-if="mostrarTblDependencias">
        <q-separator></q-separator>
        <div class="row q-my-md items-stretch">
          <div class="col">
            <q-input
              outlined
              v-model="novaDependencia"
              label="Adicionar dependência"
            >
            </q-input>
          </div>

          <q-btn
            :disabled="novaDependencia.length === 0"
            @click="addDependencia"
            class="q-ml-md"
            label="Adicionar"
            type="button"
            color="primary"
            :style="'height: 56px'"
          />
        </div>

        <q-table
          title="Dependências"
          :rows="dependencias"
          :columns="colunas"
          row-key="name"
          :selected-rows-label="getSelectedString"
          selection="multiple"
          v-model:selected="selected"
        />
      </div>
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

onBeforeMount(() => {
  // Object.assign(inventarios, inventariosDb);
});

const novaDependencia = ref("");
const mostrarTblDependencias = ref(false);
const selected = ref([]);
const name = ref("");
const unidadeDescricao = ref("");
const age = ref("");
const dependencias = reactive([]);

const colunas = ref([
  {
    name: "desc",
    required: true,
    label: "NOME",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
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

const addDependencia = () => {
  dependencias.unshift({ name: novaDependencia.value });
  novaDependencia.value = "";
};
</script>
