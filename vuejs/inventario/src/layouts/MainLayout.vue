<template>
  <q-layout view="lHh Lpr lFf">
    <layout-header></layout-header>
    <layout-drawer></layout-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LayoutDrawer from "src/components/LayoutDrawer.vue";
import LayoutHeader from "src/components/LayoutHeader.vue";
import { provide, ref } from "vue";

provide("leftDrawer", ref(false));
</script>

<style lang="sass">
.q-expansion-item__container
  padding-bottom: 5px
// .q-separator
//   margin-top: 10px
</style>
