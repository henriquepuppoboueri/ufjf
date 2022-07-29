<template>
  <!-- <header>
    <h5 class="q-my-sm text-center">Item X</h5>
  </header> -->
  <section>
    <q-form class="col q-ma-sm q-gutter-y-sm">
      <q-input outlined v-model="patrimonio" label="Patrimônio" dense />
      <q-input outlined v-model="identificador" label="Identificador" dense />
      <q-editor
        v-model="itemDescricao"
        min-height="5rem"
        placeholder="Descrição"
        dense
      />
      <q-select
        outlined
        v-model="setor"
        :options="setoresDependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Setor"
        dense
      />
      <q-select
        outlined
        v-model="dependencia"
        :options="dependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Dependência"
        dense
      />
      <q-input outlined v-model="empenho" label="Empenho" dense />
      <q-select
        outlined
        v-model="estadoPlaqueta"
        :options="estadosPlaquetas"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
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
        v-model="situacao"
        :options="situacoes"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Situação"
        dense
      />
      <q-input outlined disabled v-model="usuario" label="Usuário" dense />
    </q-form>
  </section>
  <section class="row q-gutter-x-sm q-px-sm q-my-md">
    <q-btn dense color="green" label="Salvar" />
    <q-btn
      dense
      color="primary"
      label="Cancelar"
      :to="{ name: 'itensColetados' }"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";
import { useUsuariosStore } from "src/stores/usuarios";
import { useItensStore } from "src/stores/itens";
import { useSetoresStore } from "src/stores/setores";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSituacaoStore } from "src/stores/situacao";
import { useDependenciasStore } from "src/stores/dependencias";
import { usePlaquetaStore } from "src/stores/plaqueta";

const plaquetaStore = usePlaquetaStore();
const dependenciasStore = useDependenciasStore();
const situacaoStore = useSituacaoStore();
const router = useRouter();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensStore = useItensStore();
const usuariosStore = useUsuariosStore();
const identificador = ref("");
const itemDescricao = ref("");
const dependenciaAtual = ref("");
const empenho = ref("");
const estadoPlaquetaLista = ref([]);
const nomeFornecedor = ref("");
const itemLocalizacao = ref("");
const itemObservacao = ref("");
const patrimonio = ref([]);
const { dependencias, dependencia } = storeToRefs(dependenciasStore);
const { setoresDependencias, setor } = storeToRefs(setoresStore);
const { situacoes, situacao } = storeToRefs(situacaoStore);
const { estadoPlaqueta, estadosPlaquetas } = storeToRefs(plaquetaStore);
const usuario = ref("");
let itemOrigem = "";

onMounted(async () => {
  const idItem = +route.params.idItem;
  if (!idItem) return;

  const origem = route.path;
  // let itemOrigem = {};
  const { itemImportado, itemColetado } = storeToRefs(itensStore);

  if (origem.includes("importados")) {
    await itensStore.buscarItemImportado(idItem);
    itemOrigem = itemImportado;
  } else {
    await itensStore.buscarItemColetado(idItem);
    itemOrigem = itemColetado;
    montaColetado();
  }
});

async function montaColetado() {
  await setoresStore.buscarSetoresDependencias(itemOrigem.value.inventario);
  await setoresStore.buscarSetor(itemOrigem.value.setor);
  await dependenciasStore.buscarDependencia(itemOrigem.value.dependencia);
  await dependenciasStore.buscarDependencias(itemOrigem.value.setor);
  await situacaoStore.buscarSituacoes();
  await situacaoStore.buscarSituacao(itemOrigem.value.situacao);
  await plaquetaStore.buscarEstadosPlaquetas();
  await plaquetaStore.buscarEstadoPlaqueta(itemOrigem.value.estadoPlaqueta);

  patrimonio.value = itemOrigem.value.patrimonio;
  identificador.value = itemOrigem.value.identificador;
  itemDescricao.value = itemOrigem.value.descricao;
  empenho.value = itemOrigem.value.empenho;

  dependenciaAtual.value = itemOrigem.value.dependencia.nome;
  nomeFornecedor.value = itemOrigem.value.fornecedor;
  usuario.value = itemOrigem.value.usuario;
  situacao.value = extraiSituacao(itemOrigem.value.situacao);
  itemLocalizacao.value = itemOrigem.value.localizacao;
  itemObservacao.value = itemOrigem.value.observacao;
}
function extraiSituacao(idSituacao) {
  return situacoes.value.find((situ) => situ.id === idSituacao);
}

watch(setor, (nv) => console.log(nv));
</script>
