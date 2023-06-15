<script setup>
const props = defineProps({ inventario: { type: Object } });
</script>

<template>
  <q-btn-dropdown
    v-if="inventario && inventario?.situacaoInventario?.nome !== 'Preparando'"
    auto-close
    stretch
    flat
    label="Relatórios"
  >
    <q-list v-for="relatorio in relatoriosLista" :key="relatorio.descricao">
      <q-item
        clickable
        :to="{
          name: 'relatorios',
          query: { relatorio: relatorio.nome },
        }"
        exact
      >
        <q-item-section>{{ relatorio.descricao }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<style scoped></style>
