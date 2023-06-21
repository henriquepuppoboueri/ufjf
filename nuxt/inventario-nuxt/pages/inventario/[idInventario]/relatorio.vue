<script setup>
import RelatorioBase from '/components/inventarios/relatorio/RelatorioBase.vue';
import RelLocalizacoesItens from '/components/inventarios/relatorio/RelLocalizacoesItens.vue';

definePageMeta({
  name: 'relatorios',
});

// const mapRelComps = {};
// relatoriosLista.forEach((rel) => {
//   mapRelComps[rel?.nome] = `/components/inventarios/relatorio/${
//     rel?.componente || 'RelatorioBase'
//   }.vue`;
// });
// const relComp = computed(() => mapRelComps[nomeRelatorio.value]);

const route = useRoute();
const nomeRelatorio = ref(null);

onBeforeMount(() => {
  nomeRelatorio.value = route.query?.nome;
});

watch(
  () => route.query,
  (query) => {
    nomeRelatorio.value = query?.nome;
  }
);
</script>

<template>
  <div v-if="nomeRelatorio === 'localizacoes'">
    <rel-localizacoes-itens></rel-localizacoes-itens>
  </div>
  <div v-if="nomeRelatorio !== 'localizacoes'">
    <relatorio-base :nome="nomeRelatorio"></relatorio-base>
  </div>
  <!-- <div v-if="isRelatorioPadrao">
    <relatorio-base :nome="nomeRelatorio"></relatorio-base>
  </div>
  <div v-else-if="nomeRelatorio === 'localizacoes'"></div> -->
  <!-- <component v-if="relComp" :is="relComp" /> -->
  <!-- <rel-localizacoes-itens :nome="nomeRelatorio"></rel-localizacoes-itens> -->
</template>
