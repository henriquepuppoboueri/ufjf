<script setup lang="ts">
const { idInventario } = useRoute().params;
navigateTo({
  path: `/inventario/${idInventario}/resumo/setores`,
  replace: true,
});
</script>

<template>
  <div>
    Página de visualização do inventário {{ $route.params.idInventario }}.
  </div>
</template>

<style scoped></style>
