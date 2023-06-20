<script setup>
const inventariosStore = useInventariosStore();
const { inventario } = storeToRefs(inventariosStore);
const { buscarInventario } = inventariosStore;

onBeforeMount(async () => {
  const { idInventario } = useRoute().params;
  await buscarInventario(idInventario);
});
</script>

<template>
  <div class="menu-inventario">
    <inventario-header :nome="inventario?.nome"></inventario-header>
    <inventario-menu :inventario="inventario"></inventario-menu>
    <div class="q-px-none">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
.q-btn:before {
  border-radius: 0;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
