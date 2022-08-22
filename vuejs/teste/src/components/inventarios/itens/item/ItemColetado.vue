<template>
  <q-form @submit.prevent="onSubmit">
    <section class="col q-ma-sm q-gutter-y-sm">
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
      <q-input
        outlined
        disabled
        v-model="itemUsuario"
        label="Usuário"
        dense
        disable
      />
    </section>
    <section class="row q-gutter-x-sm q-px-sm q-my-md">
      <q-btn dense color="green" label="Salvar" type="submit" />
      <q-btn
        dense
        color="primary"
        label="Cancelar"
        :to="{ name: 'itensColetados' }"
      />
    </section>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { useSetoresStore } from "src/stores/setores";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSituacaoStore } from "src/stores/situacao";
import { useDependenciasStore } from "src/stores/dependencias";
import { usePlaquetaStore } from "src/stores/plaqueta";
import { useAuthStore } from "src/stores/auth";

console.clear();
const router = useRouter();
const authStore = useAuthStore();
const plaquetaStore = usePlaquetaStore();
const dependenciasStore = useDependenciasStore();
const situacaoStore = useSituacaoStore();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
const identificador = ref("");
const itemDescricao = ref("");
const dependenciaAtual = ref("");
const setorAtual = ref("");
const empenho = ref("");
const nomeFornecedor = ref("");
const itemLocalizacao = ref("");
const itemObservacao = ref("");
const patrimonio = ref([]);
const { dependencias, dependencia } = storeToRefs(dependenciasStore);
const { setoresDependencias, setor } = storeToRefs(setoresStore);
const { situacoes, situacao } = storeToRefs(situacaoStore);
const { estadoPlaqueta, estadosPlaquetas } = storeToRefs(plaquetaStore);
const { itemColetado } = storeToRefs(itensColetadosStore);
const { usuario } = storeToRefs(authStore);
const itemUsuario = ref("");
const isModoEdicao = ref(false);
const idInventario = ref(null);

onMounted(async () => {
  const idItem = +route.params.idItem;
  idInventario.value = +route.params.idInventario;
  isModoEdicao.value = !!idItem;

  await situacaoStore.buscarSituacoes();
  await plaquetaStore.buscarEstadosPlaquetas();
  await setoresStore.buscarSetoresDependencias(idInventario.value);

  if (isModoEdicao.value) await montaFormEditar(idItem);
  if (!isModoEdicao.value) {
    dependencia.value = null;
    setor.value = null;
    estadoPlaqueta.value = null;
  }
});

watch(setor, (nv, ov) => {
  if (nv) {
    dependenciasStore.buscarDependencias(nv.id);
    dependenciasStore.dependencia = [];
  }
});

async function montaFormEditar(idItem) {
  await itensColetadosStore.buscarItemColetado(idItem);
  // await setoresStore.buscarSetoresDependencias(itemColetado.value.inventario);
  await setoresStore.buscarSetor(itemColetado.value.idSetor);
  await dependenciasStore.buscarDependencia(itemColetado.value.idDependencia);
  await dependenciasStore.buscarDependencias(itemColetado.value.idSetor);
  // await situacaoStore.buscarSituacoes();
  await situacaoStore.buscarSituacao(itemColetado.value.situacao);
  // await plaquetaStore.buscarEstadosPlaquetas();
  await plaquetaStore.buscarEstadoPlaqueta(itemColetado.value.idEstadoPlaqueta);

  patrimonio.value = itemColetado.value.patrimonio;
  identificador.value = itemColetado.value.identificador;
  itemDescricao.value = itemColetado.value.descricao;
  empenho.value = itemColetado.value.empenho;

  // dependenciaAtual.value = itemColetado.value.dependencia;
  setorAtual.value = setor.value;
  nomeFornecedor.value = itemColetado.value.fornecedor;
  itemUsuario.value = itemColetado.value.usuario;
  situacao.value = extraiSituacao(itemColetado.value.situacao);
  itemLocalizacao.value = itemColetado.value.localizacao;
  itemObservacao.value = itemColetado.value.observacao;
}

function extraiSituacao(idSituacao) {
  return situacoes.value.find((situ) => situ.id === idSituacao);
}

async function onSubmit() {
  const item = {
    descricao: itemDescricao.value,
    // id: !!itemColetado.value.id ? itemColetado.value.id : 0,
    idSetor: setor.value.id,
    idDependencia: dependencia.value.id,
    idEstadoPlaqueta: estadoPlaqueta.value.id,
    idInventario: idInventario.value,
    // idItem: itemColetado.value.item,
    identificador: identificador.value,
    fornecedor: nomeFornecedor.value,
    localizacao: itemLocalizacao.value,
    observacao: itemObservacao.value,
    patrimonio: patrimonio.value,
    idSituacao: situacao.value.id,
  };
  if (isModoEdicao.value) {
    try {
      item.id = itemColetado.value.id;
      item.idItem = itemColetado.value.item;
      await itensColetadosStore.editItemColetado(item.id, item);
      router.replace({ name: "itensColetados" });
    } catch (error) {}
  } else {
    item.usuario = usuario.value.id;
    item.idItem = 54923;
    const response = await itensColetadosStore.addItemColetado(item);
  }
}
</script>

<style lang="sass">

.q-btn
  min-width: 5rem
</style>
