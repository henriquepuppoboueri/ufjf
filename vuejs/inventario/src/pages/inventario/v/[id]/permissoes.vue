<script setup>
import InventarioPermissoesInput from "src/components/InventarioPermissoesInput.vue";
import InventarioPermissoesTabela from "src/components/InventarioPermissoesTabela.vue";
</script>

<template>
  <div class="col permissoes q-gutter-y-sm q-pa-sm">
    <inventario-permissoes-input></inventario-permissoes-input>
    <inventario-permissoes-tabela></inventario-permissoes-tabela>
  </div>
</template>

<style lang="sass">



.q-field--outlined
  border-color: red

.q-dialog-plugin
  padding: 0.5rem

.q-card__actions
  // padding-bottom: 0

.q-dialog__title
  text-align: center

.q-dialog__message
  text-align: justify
</style>
