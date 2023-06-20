<script setup>
const { inventario } = defineProps({
  inventario: {
    type: Object,
  },
});
</script>

<template>
  <q-tabs dense class="bg-red text-white shadow-none">
    <inventario-menu-resumo :inventario="inventario"></inventario-menu-resumo>
    <inventario-menu-itens></inventario-menu-itens>
    <q-btn class="btn-nav" :to="{ name: 'unidades' }">DEPENDÊNCIAS</q-btn>
    <q-btn class="btn-nav" :to="{ name: 'permissoes' }">PERMISSÕES</q-btn>
    <inventario-menu-relatorios
      :inventario="inventario"
    ></inventario-menu-relatorios>
  </q-tabs>
</template>

<style scoped></style>
