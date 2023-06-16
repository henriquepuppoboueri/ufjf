<template>
  <div>
    Página de visualização do inventário {{ $route.params.idInventario }}.
  </div>
</template>

<script setup lang="ts">
const { idInventario } = useRoute().params;
navigateTo({
  path: `/inventario/${idInventario}/resumo/setores`,
  replace: true,
});
</script>

<style scoped></style>
