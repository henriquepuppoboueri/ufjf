<template>
  <q-btn-dropdown
    v-if="inventario && inventario?.situacaoInventario?.nome !== 'Preparando'"
    auto-close
    stretch
    flat
    label="Relatórios"
  >
    <q-list v-for="relatorio in relatorioLista" :key="relatorio.name">
      <q-item
        clickable
        :to="{
          name: 'relatorioBase',
          query: { relatorio: relatorio.name },
        }"
        exact
      >
        <q-item-section>{{ relatorio.description }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
const props = defineProps({ inventario: { type: Object, required: true } });
const relatorioLista = [
  { name: 'sem-patrimonio', description: 'Bens sem patrimônio' },
  { name: 'bens-nao-coletados', description: 'Bens não coletados' },
  { name: 'plaquetas-problemas', description: 'Plaquetas com problemas' },
  { name: 'local-diferente', description: 'Bens em outras unidades' },
  { name: 'sem-itens', description: 'Coletas sem itens' },
  { name: 'repetidos', description: 'Coletas repetidas' },
];
</script>

<style scoped></style>
