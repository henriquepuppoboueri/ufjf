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
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import moment from "moment";

import { useAuthStore } from "src/stores/auth";
import LayoutDrawer from "src/components/LayoutDrawer.vue";
import LayoutHeader from "src/components/LayoutHeader.vue";

const authStore = useAuthStore();
const { carregando, erro } = storeToRefs(authStore);
const usuario = authStore.usuario;
const leftDrawerOpen = ref(true);
const dataExpiraToken = computed(() => {
  return moment(usuario.dataExt).format("MMMM Do YYYY, h:mm a");
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {});
</script>

<style lang="sass">
.q-expansion-item__container
  padding-bottom: 5px
// .q-separator
//   margin-top: 10px
</style>
