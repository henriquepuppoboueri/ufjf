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
  {{ itemColetado }} asas
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from "vue";
import { useUsuariosStore } from "src/stores/usuarios";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { useSetoresStore } from "src/stores/setores";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSituacaoStore } from "src/stores/situacao";
import { useDependenciasStore } from "src/stores/dependencias";
import { usePlaquetaStore } from "src/stores/plaqueta";

console.clear();
const plaquetaStore = usePlaquetaStore();
const dependenciasStore = useDependenciasStore();
const situacaoStore = useSituacaoStore();
const router = useRouter();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
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
const { itemColetado } = storeToRefs(itensColetadosStore);
const usuario = ref("");

onMounted(async () => {
  const idItem = +route.params.idItem;
  if (!idItem) return;

  await montaColetado(idItem);
});

async function montaColetado(idItem) {
  await itensColetadosStore.buscarItemColetado(idItem);
  // await setoresStore.buscarSetoresDependencias(itemColetado.value.inventario);
  await setoresStore.buscarSetor(itemColetado.value.setor);
  await dependenciasStore.buscarDependencia(itemColetado.value.dependencia);
  await dependenciasStore.buscarDependencias(itemColetado.value.setor);
  await situacaoStore.buscarSituacoes();
  await situacaoStore.buscarSituacao(itemColetado.value.situacao);
  await plaquetaStore.buscarEstadosPlaquetas();
  await plaquetaStore.buscarEstadoPlaqueta(itemColetado.value.estadoPlaqueta);

  patrimonio.value = itemColetado.value.patrimonio;
  identificador.value = itemColetado.value.identificador;
  itemDescricao.value = itemColetado.value.descricao;
  empenho.value = itemColetado.value.empenho;

  dependenciaAtual.value = itemColetado.value.dependencia;
  nomeFornecedor.value = itemColetado.value.fornecedor;
  usuario.value = itemColetado.value.usuario;
  situacao.value = extraiSituacao(itemColetado.value.situacao);
  itemLocalizacao.value = itemColetado.value.localizacao;
  itemObservacao.value = itemColetado.value.observacao;
}

function extraiSituacao(idSituacao) {
  return situacoes.value.find((situ) => situ.id === idSituacao);
}
</script>
