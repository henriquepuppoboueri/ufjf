<template>
  <q-tabs dense class="bg-red text-white shadow-none">
    <inventario-menu-resumo :inventario="inventario"></inventario-menu-resumo>
    <inventario-menu-itens></inventario-menu-itens>
    <q-btn class="btn-nav" :to="{ name: 'Unidades' }">DEPENDÊNCIAS</q-btn>
    <q-btn class="btn-nav" :to="{ name: 'Permissoes' }">PERMISSÕES</q-btn>
    <inventario-menu-relatorios
      :inventario="inventario"
    ></inventario-menu-relatorios>
  </q-tabs>
</template>

<script setup>
import { storeToRefs } from "pinia";

import { useInventariosStore } from "src/stores/inventarios";
import InventarioMenuRelatorios from "./InventarioMenuRelatorios.vue";
import InventarioMenuResumo from "./InventarioMenuResumo.vue";
import InventarioMenuItens from "./InventarioMenuItens.vue";

const inventariosStore = useInventariosStore();
const { inventario } = storeToRefs(inventariosStore);
</script>

<style scoped></style>
