<script setup>
import { inject, onMounted } from "vue";

import { useAuthStore } from "src/stores/auth";
import DrawerHeader from "src/components/DrawerHeader.vue";
import DrawerList from "src/components/DrawerList.vue";

const { usuario } = useAuthStore();

const leftDrawer = inject("leftDrawer");

onMounted(() => {});
</script>

<style scoped></style>

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
