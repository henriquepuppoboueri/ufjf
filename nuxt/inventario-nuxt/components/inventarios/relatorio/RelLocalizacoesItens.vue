<script setup>
import { exportTable } from '/helper/functions';

const route = useRoute();
const idInventario = ref(0);
const filtro = ref('');

const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);
const { buscarDadosRelatorio, $resetRelatorio } = relatoriosStore;

const relatorioFormatado = computed(() =>
  relatorio.value
    .map((item) => ({
      id: item.setor.id,
      label: `${item.setor.nome} [${item.qtde}]`,
      icon: 'apartment',
      qtde: item.qtde,
      children: item.localizacoesDependencias
        .map((dep) => ({
          qtde: dep.qtde,
          id: dep.dependencia.id,
          label: `${dep.dependencia.nome} [${dep.qtde}]`,
          icon: 'home',
          children: dep.localizacoes
            .map((localizacao) => ({
              label: `${localizacao.localizacao} [${localizacao.qtde}]`,
              qtde: localizacao.qtde,
            }))
            .filter((localizacao) => localizacao.qtde > 0),
        }))
        .filter((dep) => dep.qtde > 0),
    }))
    .filter((item) => item.qtde > 0)
);

onBeforeMount(async () => {
  idInventario.value = route.params['idInventario'];
  await buscarDadosRelatorio({
    nome: 'localizacoes',
    params: { idInventario: idInventario.value },
  });
  console.log('carregando relatorio', relatorio);
});

onUnmounted(() => {
  $resetRelatorio();
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
    <q-card-section
      v-if="relatorio && relatorioFormatado"
      class="col q-gutter-md"
    >
      <q-input
        v-model="filtro"
        outlined
        type="text"
        label="Filtro"
        icon
        class="bg-grey-3"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-tree :filter="filtro" :nodes="relatorioFormatado" node-key="label" />
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
