<template>
  <div class="q-px-md">
    <h3 class="q-my-md">Estatísticas</h3>
    <router-view></router-view>
    <q-separator></q-separator>
    <span class="text-overline" v-if="dados"
      >Data dos dados: {{ dados.data }} - solicitado por:
      {{ dados.solicitadoPor }}
    </span>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useEstatisticasStore } from "stores/estatisticas";

const estatisticasStore = useEstatisticasStore();
const { dados } = storeToRefs(estatisticasStore);
</script>
