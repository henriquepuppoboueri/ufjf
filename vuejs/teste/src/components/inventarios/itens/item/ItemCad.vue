<template>
  <!-- <header>
    <h5 class="q-my-sm text-center">Item X</h5>
  </header> -->
  <section>
    <q-form class="col q-ma-sm q-gutter-y-sm">
      <q-input outlined v-model="patrimonio" label="Patrimônio" dense />
      <q-editor
        v-model="itemDescricao"
        min-height="5rem"
        placeholder="Descrição"
        dense
      />
      <q-select
        outlined
        v-model="setorAtual"
        :options="setorLista"
        label="Setor"
        dense
      />
      <q-select
        outlined
        v-model="dependenciaAtual"
        :options="dependenciaLista"
        label="Dependência"
        dense
      />
      <q-input outlined v-model="empenho" label="Empenho" dense />
      <q-select
        outlined
        v-model="estadoPlaquetaAtual"
        :options="estadoPlaquetaLista"
        label="Estado da plaqueta"
        dense
      />
      <q-input outlined v-model="nomeFornecedor" label="Fornecedor" dense />
      <q-editor
        v-model="itemLocalizacao"
        min-height="5rem"
        placeholder="Localização"
        dense
      />
      <q-editor
        v-model="itemObservacao"
        min-height="5rem"
        placeholder="Observação"
        dense
      />
      <q-select
        outlined
        v-model="situacaoAtual"
        :options="situacaoLista"
        label="Situação"
        dense
      />
      <q-input outlined disabled v-model="usuario" label="Usuário" dense />
    </q-form>
  </section>
  <section class="row q-gutter-x-sm q-px-sm q-my-md">
    <q-btn dense color="green" label="Salvar" />
    <q-btn dense color="primary" label="Cancelar" @click="cancelar" />
  </section>
</template>

<script setup>
import { ref, onMounted, onUpdated } from "vue";
import { useUsuariosStore } from "src/stores/usuarios";
import { useItensStore } from "src/stores/itens";
import { useSetoresStore } from "src/stores/setores";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensStore = useItensStore();
const usuariosStore = useUsuariosStore();
const props = defineProps({ id: Number });
const itemDescricao = ref("");
const setorAtual = ref("");
const setorLista = ref([]);
const dependenciaAtual = ref("");
const dependenciaLista = ref([]);
const empenho = ref("");
const estadoPlaquetaAtual = ref("");
const estadoPlaquetaLista = ref([]);
const nomeFornecedor = ref("");
const itemLocalizacao = ref("");
const itemObservacao = ref("");
const patrimonio = ref([]);
const situacaoAtual = ref("");
const situacaoLista = ref([]);
const usuario = ref("");

onMounted(async () => {
  const idItem = +route.params.idItem;
  const origem = route.path;
  let itemOrigem = {};
  if (!idItem) return;

  const { itemImportado, itemColetado } = storeToRefs(itensStore);

  if (origem.includes("importados")) {
    await itensStore.buscarItemImportado(idItem);
    itemOrigem = itemImportado;
    console.log(itemOrigem);
  } else {
    await itensStore.buscarItemColetado(idItem);
    itemOrigem = itemColetado;
  }

  patrimonio.value = itemOrigem.value.patrimonio;
  itemDescricao.value = itemOrigem.value.descricao;
  empenho.value = itemOrigem.value.empenho;
  setorAtual.value = itemOrigem.value.setor.nome;
  dependenciaAtual.value = itemOrigem.value.dependencia.nome;
  // estadoPlaquetaAtual.value = itemData.
  nomeFornecedor.value = itemOrigem.value.fornecedor;
  // situacaoAtual.value = itemData.situacaoInventario.nome;
  // const item = buscarItemPorId(props.id);
  // itemDescricao.value = item.descricao;
});

onUpdated(() => {
  // const item = buscarItemPorId(props.id);
  // itemDescricao.value = item.descricao;
});

// function buscarItemPorId(id) {
//   return itemsColetados.value.find((i) => i.id === id);
// }

function cancelar() {
  router.go(-1);
}
</script>
