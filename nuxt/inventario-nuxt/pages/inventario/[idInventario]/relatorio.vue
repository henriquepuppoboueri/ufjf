<script setup>
import RelatorioBase from '/components/inventarios/relatorio/RelatorioBase.vue';
import RelLocalizacoesItens from '/components/inventarios/relatorio/RelLocalizacoesItens.vue';

definePageMeta({
  name: 'relatorios',
});

const mapRelComps = { localizacoes: RelLocalizacoesItens };
const relComp = computed(
  () => mapRelComps[nomeRelatorio.value] || RelatorioBase
);
const route = useRoute();
const nomeRelatorio = ref(null);
const relatorioSelec = computed(() =>
  relatoriosLista.find((relatorio) => relatorio.nome === nomeRelatorio.value)
);

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
  <!-- <div v-if="isRelatorioPadrao">
    <relatorio-base :nome="nomeRelatorio"></relatorio-base>
  </div>
  <div v-else-if="nomeRelatorio === 'localizacoes'"></div> -->
  <div>
    <!-- <component ref="comp" :is="mapRelComps[nomeRelatorio]"></component> -->
    <rel-localizacoes-itens :nome="nomeRelatorio"></rel-localizacoes-itens>
  </div>
</template>
