<script setup>
import { inject, ref } from 'vue';
const leftDrawer = inject('leftDrawer', ref(true));

function toggleLeftDrawer() {
  leftDrawer.value = !leftDrawer.value;
}
</script>

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

<style scoped></style>
