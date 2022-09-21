<template>
  <q-form @submit.prevent="onSubmit">
    <section class="col q-ma-sm q-gutter-y-sm">
      <div class="row q-gutter-x-sm justify-between no-wrap">
        <q-input
          outlined
          v-model="patrimonio"
          label="Patrimônio"
          dense
          class="fit"
          :rules="[
            (val) => exactLength(val, 6, 'Patrimônio deve conter 6 caracteres'),
          ]"
        />
        <q-btn
          color="blue"
          label="Buscar"
          type="button"
          @click="buscarItemPorPatrimonio"
          :disable="patrimonio.length < 6"
          v-if="!isModoEdicao"
        />
      </div>

      <q-input
        outlined
        v-model="identificador"
        label="Identificador"
        dense
        :rules="[
          (val) =>
            exactLength(val, 5, 'Identificador deve conter 5 caracteres'),
        ]"
      />
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
      <!-- <q-input outlined v-model="empenho" label="Empenho" dense /> -->
      <q-editor
        v-model="itemLocalizacao"
        min-height="2rem"
        placeholder="Localização"
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
      <q-select
        outlined
        v-model="estadoPlaqueta"
        :options="estadosPlaquetas"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Estado da plaqueta"
        dense
      />
      <!-- <q-input outlined v-model="nomeFornecedor" label="Fornecedor" dense /> -->
      <q-editor
        v-model="itemObservacao"
        min-height="5rem"
        placeholder="Observação"
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
      <q-btn
        dense
        color="green"
        label="Salvar"
        type="submit"
        :disabled="desabilitaSalvar"
      />
      <q-btn dense color="primary" label="Cancelar" @click="router.go(-1)" />
    </section>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { useSetoresStore } from "src/stores/setores";
import { useItensImportadosStore } from "src/stores/itensImportados";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSituacaoStore } from "src/stores/situacao";
import { useDependenciasStore } from "src/stores/dependencias";
import { usePlaquetaStore } from "src/stores/plaqueta";
import { useAuthStore } from "src/stores/auth";
import { exactLength } from "src/helper/formValidation";

const patrimonioBuscado = false;
const router = useRouter();
const authStore = useAuthStore();
const plaquetaStore = usePlaquetaStore();
const dependenciasStore = useDependenciasStore();
const situacaoStore = useSituacaoStore();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
const itensImportadosStore = useItensImportadosStore();
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
const { itemImportado } = storeToRefs(itensImportadosStore);
const { buscarItemImportadoPorPatrimonio } = itensImportadosStore;
const { itemColetado } = storeToRefs(itensColetadosStore);
const { usuario } = storeToRefs(authStore);
const itemUsuario = ref("");
const isModoEdicao = ref(false);
const idInventario = ref(null);

const desabilitaSalvar = computed(() => {
  if (patrimonio.value.length !== 6) return true;
  if (identificador.value.length !== 5) return true;
  if (!setor.value) return true;
  if (!dependencia.value) return true;

  return false;
});

watch(setor, (nv, ov) => {
  if (nv) {
    dependenciasStore.buscarDependencias(nv.id);
    dependenciasStore.dependencia = null;
  }
});

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
    situacao.value = null;
    itemUsuario.value = usuario.value.login;
  }
});

async function montaFormEditar(idItem) {
  await itensColetadosStore.buscarItemColetado(idItem);
  await setoresStore.buscarSetor(itemColetado.value.idSetor);
  await dependenciasStore.buscarDependencia(itemColetado.value.idDependencia);
  await dependenciasStore.buscarDependencias(itemColetado.value.idSetor);
  await situacaoStore.buscarSituacao(itemColetado.value.situacao);
  await plaquetaStore.buscarEstadoPlaqueta(itemColetado.value.idEstadoPlaqueta);

  patrimonio.value = itemColetado.value.patrimonio;
  identificador.value = itemColetado.value.identificador;
  itemDescricao.value = itemColetado.value.descricao;
  empenho.value = itemColetado.value.empenho;

  setorAtual.value = setor.value;
  nomeFornecedor.value = itemColetado.value.fornecedor;
  itemUsuario.value = itemColetado.value.usuario;
  situacao.value = extraiSituacao(itemColetado.value.situacao);
  itemLocalizacao.value = itemColetado.value.localizacao;
  itemObservacao.value = itemColetado.value.observacao;
}

async function buscarItemPorPatrimonio() {
  await buscarItemImportadoPorPatrimonio(patrimonio.value, idInventario.value);
  itemDescricao.value = itemImportado.value.descricao;
  setor.value = itemImportado.value.setor;
  await dependenciasStore.buscarDependencias(itemImportado.value.setor.id);
  dependencia.value = itemImportado.value.dependencia;
}

function extraiSituacao(idSituacao) {
  return situacoes.value.find((situ) => situ.id === idSituacao);
}

async function onSubmit() {
  const item = {
    descricao: itemDescricao.value,
    idSetor: setor.value.id,
    idDependencia: dependencia.value.id,
    idEstadoPlaqueta: estadoPlaqueta.value.id,
    idInventario: idInventario.value,
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
      router.go(-1);
    } catch (error) {}
  } else {
    // if (Object.hasOwnProperty(itemImportado.value.id)) {
    item.idItem = itemImportado.value.id;
    item.usuario = usuario.value.id;
    // }
    await itensColetadosStore.addItemColetado(item);
    router.go(-1);
  }
}
</script>

<style lang="sass">

.q-btn
  min-width: 5rem
</style>
