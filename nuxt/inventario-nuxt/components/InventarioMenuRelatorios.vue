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
    <q-list>
      <q-item
        v-for="relatorio in relatoriosLista"
        :key="relatorio.descricao"
        clickable
        :to="{
          name: 'relatorios',
          params: { nome: relatorio.nome },
        }"
        exact
      >
        <q-item-section>{{ relatorio.descricao }}</q-item-section>
      </q-item>
      <!-- <q-item
        key="localizacoes"
        clickable
        :to="{
          name: 'relatorios',
          params: { nome: 'localizacoes' },
        }"
        exact
      >
        <q-item-section>Localizações</q-item-section>
      </q-item> -->
    </q-list>
  </q-btn-dropdown>
</template>

<style scoped></style>
