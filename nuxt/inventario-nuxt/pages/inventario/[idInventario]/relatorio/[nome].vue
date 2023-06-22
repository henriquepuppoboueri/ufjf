<script setup>
import RelatorioBase from '/components/inventarios/relatorio/RelatorioBase.vue';
import RelLocalizacoesItens from '/components/inventarios/relatorio/RelLocalizacoesItens.vue';

definePageMeta({
  name: 'relatorios',
});

const relatorio = computed(() => {
  const { nome } = useRoute().params;
  return nome;
});

// usar flat() em vez do forEach
// const mapRelComps = {};
// relatoriosLista.forEach((rel) => {
//   mapRelComps[rel?.nome] = `/components/inventarios/relatorio/${
//     rel?.componente || 'RelatorioBase'
//   }.vue`;
// });
// const relComp = computed(() => mapRelComps[nomeRelatorio.value]);
</script>

<template>
  <div v-if="relatorio === 'localizacoes'">
    <rel-localizacoes-itens></rel-localizacoes-itens>
  </div>
  <div v-if="relatorio !== 'localizacoes'">
    <relatorio-base :nome="relatorio" />
  </div>
  <!-- <div v-if="isRelatorioPadrao">
    <relatorio-base :nome="nomeRelatorio"></relatorio-base>
  </div>
  <div v-else-if="nomeRelatorio === 'localizacoes'"></div> -->
  <!-- <component v-if="relComp" :is="relComp" /> -->
  <!-- <rel-localizacoes-itens :nome="nomeRelatorio"></rel-localizacoes-itens> -->
</template>
