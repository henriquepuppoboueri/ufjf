<template>
  <p class="text-h4 text-center q-mt-md">
    {{ "Inventário 001".toUpperCase() }}
  </p>
  <q-tabs v-model="tabSelecionada" dense class="bg-red text-white shadow-none">
    <q-btn-dropdown auto-close stretch flat label="Itens">
      <q-list>
        <q-item clickable :to="`items?origem=importados`">
          <q-item-section>Itens originais (importados)</q-item-section>
        </q-item>
        <q-item clickable :to="`items?origem=lancados`">
          <q-item-section>Itens coletados (lançados)</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn class="btn-nav" :to="{ name: 'unidades' }">DEPENDÊNCIAS</q-btn>
  </q-tabs>
  <div class="q-px-none">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { date, Notify } from "quasar";
import { API_URL } from "../../helper/constants.js";

import ItemsColetados from "../inventarios/items/ItemsColetados.vue";
import DependenciaLista from "./unidades/UnidadesLista.vue";

const tabSelecionada = ref("itens_coletados");
const id = ref(0);
const modoEdicao = ref(false);
const route = useRoute();
const router = useRouter();
const mostrarTblPermissoes = ref(false);
const dataCriacao = ref("30/06/2022");
const selected = reactive([]);
const inventarioDescricao = ref("");
const statusAtual = ref("");
const nomeInventario = ref("");
const usuarios = ref([]);
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

const isItem = computed(() => {
  return ["itens_originais", "itens_coletados"].includes(tabSelecionada.value);
});

onMounted(() => {
  if ("id" in route.params) {
    // modo de edição ou visualização
    id.value = +route.params.id;

    axios.get(`${API_URL}v1/restrito/inventario/${id.value}`).then((res) => {
      const inventario = res.data;
      nomeInventario.value = inventario.nome;
    });
  } else {
    return;
  }
});
function onSubmit() {}
</script>

<style>
.q-btn:before {
  border-radius: 0;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
