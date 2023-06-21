<script setup>
import { exportTable } from '/helper/functions';

const route = useRoute();
const idInventario = ref(0);

const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);
const { buscarDadosRelatorio, $resetRelatorio } = relatoriosStore;

const relatorioFormatado = computed(() =>
  relatorio.value.map((item) => ({
    id: item.setor.id,
    label: item.setor.nome,
    qtde: item.qtde,
    children: item.localizacoesDependencias.map((dep) => ({
      qtde: dep.qtde,
      id: dep.dependencia.id,
      label: dep.dependencia.nome,
      children: dep.localizacoes.map((localizacao) => ({
        label: localizacao.localizacao,
        qtde: localizacao.qtde,
      })),
    })),
  }))
);

onBeforeMount(async () => {
  idInventario.value = route.params['idInventario'];
  await buscarDadosRelatorio({
    nome: 'localizacoes',
    params: { idInventario: idInventario.value },
  });
  console.log(relatorioFormatado.value);
});

function exportarDados() {
  exportTable(tabelaColunas, relatorio.value, 'bens-sem-patrimonios');
}
</script>

<template>
  <q-card bordered>
    <q-card-section class="text-center text-h5">
      Localizações dos itens coletados
    </q-card-section>
    <q-card-section class="q-ma-md" v-if="carregando">
      <q-inner-loading :showing="carregando">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card-section>
    <q-card-section v-if="relatorio && relatorioFormatado">
      <q-tree :nodes="relatorioFormatado" node-key="label" />
    </q-card-section>
    <q-card-actions v-if="!carregando && relatorio" class="q-gutter-sm">
      <q-btn
        dense
        color="red"
        class="text-white"
        label="Exportar"
        @click="exportarDados"
      />
    </q-card-actions>
  </q-card>
</template>

<style></style>
