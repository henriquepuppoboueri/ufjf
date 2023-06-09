<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';

const inventariosStore = useInventariosStore();
const { buscarInventario } = inventariosStore;
const { inventario } = storeToRefs(inventariosStore);

const idInventario = ref(0);
const _route = useRoute();

const nomeInventario = ref('');

onMounted(async () => {
  if ('idInventario' in _route.params) {
    idInventario.value = +_route.params.idInventario;

    await buscarInventario(idInventario.value);
  }
});
</script>

<template>
  <div class="menu-inventario">
    <inventario-header :nome="inventario?.nome"></inventario-header>
    <inventario-menu></inventario-menu>
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
