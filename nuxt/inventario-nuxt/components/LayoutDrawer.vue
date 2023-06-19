<script setup>
const leftDrawer = inject('leftDrawer');
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
