<template>
  <q-btn-dropdown
    v-if="inventario && inventario.situacaoInventario.nome !== 'Preparando'"
    auto-close
    stretch
    flat
    label="Resumo"
  >
    <q-list>
      <q-item
        v-for="resumo in resumoLista"
        :key="resumo.to"
        clickable
        :to="{ name: resumo.to }"
        exact
      >
        <q-item-section>{{ resumo.name }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
const props = defineProps({ inventario: { type: Object } });
const resumoLista = [
  { name: 'Por setor', to: 'resumo-setores' },
  { name: 'Por usuário', to: 'resumo-usuarios' },
  { name: 'Por semana', to: 'resumo-semanal' },
  { name: 'Por dia', to: 'resumo-diario' },
];
</script>

<style scoped></style>
