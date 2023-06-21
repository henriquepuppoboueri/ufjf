<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";

import { useInventariosStore } from "stores/inventarios";
import InventarioHeader from "src/components/InventarioHeader.vue";
import InventarioMenu from "src/components/InventarioMenu.vue";

const inventariosStore = useInventariosStore();
const { buscarInventario } = useInventariosStore();
const { inventario } = storeToRefs(inventariosStore);

const idInventario = ref(0);
const _route = useRoute();

const nomeInventario = ref("");

onMounted(async () => {
  if ("idInventario" in _route.params) {
    idInventario.value = +_route.params.idInventario;

    await buscarInventario(idInventario.value);
    nomeInventario.value = inventario.value.nome;
  }
});
</script>

<template>
  <div class="menu-inventario">
    <inventario-header :nome="nomeInventario"></inventario-header>
    <inventario-menu></inventario-menu>
    <div class="q-px-none">
      <router-view v-slot="{ Component, route }">
        <transition name="fade">
          <div :key="route.path" class="router-view-inventario">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
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
