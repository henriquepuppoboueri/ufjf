<template>
  <q-form class="col q-ma-md q-gutter-y-md">
    <q-editor
      v-model="itemDescricao"
      min-height="5rem"
      placeholder="Descrição"
    />
    <q-select
      outlined
      v-model="setorAtual"
      :options="setorLista"
      label="Setor"
    />
    <q-select
      outlined
      v-model="dependenciaAtual"
      :options="dependenciaLista"
      label="Dependência"
    />
    <q-input outlined v-model="empenho" label="Empenho" />
    <q-select
      outlined
      v-model="estadoPlaquetaAtual"
      :options="estadoPlaquetaLista"
      label="Estado da plaqueta"
    />
    <q-input outlined v-model="nomeFornecedor" label="Fornecedor" />
    <q-editor
      v-model="itemLocalizacao"
      min-height="5rem"
      placeholder="Localização"
    />
    <q-editor
      v-model="itemObservacao"
      min-height="5rem"
      placeholder="Observação"
    />
    <q-input outlined v-model="patrimonio" label="Patrimônio" />
    <q-select
      outlined
      v-model="situacaoAtual"
      :options="situacaoLista"
      label="Situação"
    />
    <q-input outlined disabled v-model="usuario" label="Usuário" />
  </q-form>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";

const props = defineProps({ id: Number });
const itemDescricao = ref("");
const setorAtual = ref("");
const setorLista = ref([]);
const dependenciaAtual = ref("");
const dependenciaLista = ref([]);
const empenho = ref("");
const estadoPlaquetaAtual = ref("");
const estadoPlaquetaLista = ref([]);
const nomeFornecedor = ref("");
const itemLocalizacao = ref("");
const itemObservacao = ref("");
const patrimonio = ref([]);
const situacaoAtual = ref("");
const situacaoLista = ref([]);
const usuario = ref("");

onMounted(() => {
  const item = buscarItemPorId(props.id);
  itemDescricao.value = item.descricao;
});

onUpdated(() => {
  const item = buscarItemPorId(props.id);
  itemDescricao.value = item.descricao;
});

function buscarItemPorId(id) {
  return itemsColetados.value.find((i) => i.id === id);
}
</script>
