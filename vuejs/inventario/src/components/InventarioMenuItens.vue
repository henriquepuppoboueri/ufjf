<template>
  <q-btn-dropdown auto-close stretch flat label="Itens">
    <q-list>
      <q-item clickable :to="{ name: 'itensColetados' }" exact>
        <q-item-section>Itens coletados (lançados)</q-item-section>
      </q-item>
      <q-item clickable :to="{ name: 'itensImportados' }" exact>
        <q-item-section>Itens originais (importados)</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup></script>

<style scoped></style>
