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
const props = defineProps({ inventario: { type: Object, required: true } });
const resumoLista = [
  { name: "Por setor", to: "resumoSetores" },
  { name: "Por usuário", to: "resumoUsuarios" },
  { name: "Por semana", to: "resumoSemana" },
  { name: "Por dia", to: "resumoDia" },
];
</script>

<style scoped></style>
