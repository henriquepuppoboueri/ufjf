<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />
      <q-toolbar-title class="flex flex-center">
        Controle de Inventário - UFJF
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref } from "vue";
const leftDrawerOpen = ref(true);
</script>

<style scoped></style>
