<script setup>
const route = useRoute();
const idInventario = ref(0);
const filtro = ref('');

const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);
const { buscarDadosRelatorio, $resetRelatorio } = relatoriosStore;

const relatorioFormatado = computed(() => {
  return !relatorio.value
    ? null
    : relatorio.value
        .map((item) => ({
          id: item.setor.id,
          key: `set-${item.setor.id}`,
          label: `${item.setor.nome} [${item.qtde}]`,
          icon: 'apartment',
          qtde: item.qtde,
          children: item.localizacoesDependencias
            .map((dep) => {
              const dep_ = {
                id: dep.dependencia.id,
                key: `set-${item.setor.id}-dep-${dep.dependencia.id}`,
                qtde: dep.qtde,
                label: `${dep.dependencia.nome} [${dep.qtde}]`,
                icon: 'home',
              };
              if (dep.localizacoes.length > 0) {
                dep_.children = dep.localizacoes
                  .map((localizacao) => ({
                    key: `${dep_.key}-loc-${randomInt()}`,
                    label: `${localizacao.localizacao} [${localizacao.qtde}]`,
                    qtde: localizacao.qtde,
                  }))
                  .filter((localizacao) => localizacao.qtde > 0);
              }
              return dep_;
            })
            .filter((dep) => dep.qtde > 0),
        }))
        .filter((item) => item.qtde > 0);
});

onBeforeMount(async () => {
  idInventario.value = route.params['idInventario'];
  await buscarDadosRelatorio({
    nome: 'localizacoes',
    params: { idInventario: idInventario.value },
  });
});

onUnmounted(() => {
  $resetRelatorio();
});
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
      <q-tree :filter="filtro" :nodes="relatorioFormatado" node-key="key" />
    </q-card-section>
  </q-card>
</template>

<style></style>
