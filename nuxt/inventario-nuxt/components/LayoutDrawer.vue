<script setup>
import { inject, onMounted } from 'vue';

import DrawerHeader from '/components/DrawerHeader.vue';
import DrawerList from '/components/DrawerList.vue';

const leftDrawer = inject('leftDrawer');

onMounted(() => {});
</script>

<template>
  <q-drawer v-model="leftDrawer" show-if-above bordered>
    <div class="q-pa-sm" style="max-width: 350px">
      <q-list class="rounded-borders">
        <drawer-header></drawer-header>
        <q-separator />
        <drawer-list></drawer-list>
      </q-list>
    </div>
  </q-drawer>
</template>

<style scoped></style>
