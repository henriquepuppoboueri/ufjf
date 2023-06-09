<template>
  <q-layout view="lHh Lpr lFf">
    <layout-header></layout-header>
    <layout-drawer></layout-drawer>
    <q-page-container>
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LayoutDrawer from '/components/LayoutDrawer.vue';
import LayoutHeader from '/components/LayoutHeader.vue';
import { provide, ref } from 'vue';

provide('leftDrawer', ref(false));
</script>

<style lang="sass">
.q-expansion-item__container
  padding-bottom: 5px
// .q-separator
//   margin-top: 10px
</style>
