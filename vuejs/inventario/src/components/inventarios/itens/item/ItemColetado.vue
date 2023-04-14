<template>
  <div v-if="mostrarCamera">
    <qr-stream @decode="onDecode"></qr-stream>
  </div>
  <q-form @submit.prevent="onSubmit">
    <section class="col q-ma-sm q-gutter-y-sm">
      <div class="row q-gutter-x-sm justify-between no-wrap">
        <q-input
          outlined
          v-model="itemColetado.patrimonio"
          label="Patrimônio"
          dense
          class="fit"
        >
        </q-input>
        <q-btn
          color="blue"
          label="Buscar"
          type="button"
          @click="buscarItemPorPatrimonio"
          v-if="!isModoEdicao"
        />
        <q-btn
          class="btn_camera"
          :color="mostrarCamera ? 'red' : 'green'"
          icon="fa-solid fa-camera"
          type="button"
          @click="mostrarCamera = !mostrarCamera"
        />
      </div>

      <q-input
        v-if="itemColetado"
        outlined
        v-model="itemColetado.identificador"
        label="Identificador"
        dense
        :rules="[
          (val) => isNumber(val, 'Identificador'),
          (val) => notStartWith(val, '0', 'Identificador'),
        ]"
      >
      </q-input>
      <q-editor
        v-model="itemColetado.descricao"
        min-height="5rem"
        placeholder="Descrição"
        dense
      />
      <q-select
        outlined
        v-model="itemColetado.setor"
        :options="setoresDependencias"
        :option-label="(item) => item.nome"
        label="Setor"
        dense
      />
      <q-select
        outlined
        v-model="itemColetado.dependencia"
        :options="dependencias"
        :option-label="(item) => item.nome"
        label="Dependência"
        dense
      />
      <q-editor
        v-model="itemColetado.localizacao"
        min-height="2rem"
        placeholder="Localização"
        dense
      />
      <q-select
        outlined
        v-model="itemColetado.situacao_"
        :options="situacoes"
        :option-label="(item) => item.nome"
        label="Situação"
        dense
      />
      <q-select
        outlined
        v-model="itemColetado.estadoPlaqueta"
        :options="estadosPlaquetas"
        :option-label="(item) => item.nome"
        label="Estado da plaqueta"
        dense
      />
      <q-editor
        v-model="itemColetado.observacao"
        min-height="5rem"
        placeholder="Observação"
        dense
      />
      <q-input
        outlined
        disabled
        v-model="itemColetado.usuario"
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
  <div>{{ itemColetado }}</div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, watch, computed, reactive } from "vue";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { useSetoresStore } from "src/stores/setores";
import { useItensImportadosStore } from "src/stores/itensImportados";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSituacaoStore } from "src/stores/situacao";
import { useDependenciasStore } from "src/stores/dependencias";
import { usePlaquetaStore } from "src/stores/plaqueta";
import { useAuthStore } from "src/stores/auth";
import { isNumber, notStartWith } from "src/helper/formValidation";
import { Notify } from "quasar";
import { QrStream } from "vue3-qr-reader";
import { useQuasar } from "quasar";

const $q = useQuasar();
const mostrarCamera = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const plaquetaStore = usePlaquetaStore();
const dependenciasStore = useDependenciasStore();
const situacaoStore = useSituacaoStore();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
const itensImportadosStore = useItensImportadosStore();

const { dependencias, dependencia } = storeToRefs(dependenciasStore);
const { setoresDependencias, setor } = storeToRefs(setoresStore);
const { situacoes, situacao } = storeToRefs(situacaoStore);
const { estadoPlaqueta, estadosPlaquetas } = storeToRefs(plaquetaStore);
const { itemImportado } = storeToRefs(itensImportadosStore);
const { buscarItemImportadoPorPatrimonio } = itensImportadosStore;
const { itemColetado, itemNominal } = storeToRefs(itensColetadosStore);
const { usuario } = storeToRefs(authStore);
const isModoEdicao = ref(false);
const idInventario = ref(null);

const desabilitaSalvar = computed(() => {
  return 0;
});

watch(itemNominal, async (newV, oldV) => {
  // console.log(await newV);
});

watch(
  () => itemColetado.value.setor,
  async (nv, ov) => {
    if (nv) {
      // if (nv && ov !== null) {
      await dependenciasStore.buscarDependencias(nv.id);
      if (nv && typeof ov !== "undefined") {
        dependenciasStore.dependencia = null;
        itemColetado.value.dependencia = null;
      }
    }
  }
);

onBeforeMount(async () => {
  const idItem = +route.params.idItem;
  idInventario.value = +route.params.idInventario;
  isModoEdicao.value = !!idItem;

  await situacaoStore.buscarSituacoes();
  await plaquetaStore.buscarEstadosPlaquetas();
  await setoresStore.buscarSetoresDependencias(idInventario.value);

  if (isModoEdicao.value) await montaFormEditar(idItem);
  if (!isModoEdicao.value) {
    // itemColetadoObj.idDependencia = null;
    // itemColetadoObj.idSetor = null;
    // itemColetadoObj.idEstadoPlaqueta = null;
    // itemColetadoObj.idSituacao = null;
    // itemColetadoObj.usuario = usuario.value.login;
  }
});

async function montaFormEditar(idItem) {
  await itensColetadosStore.buscarItemColetado(idItem);
  await setoresStore.buscarSetor(itemColetado.value.idSetor);
  await dependenciasStore.buscarDependencias(itemColetado.value.idSetor);
  await dependenciasStore.buscarDependencia(itemColetado.value.idDependencia);
  await situacaoStore.buscarSituacao(itemColetado.value.situacao);
  await plaquetaStore.buscarEstadoPlaqueta(itemColetado.value.idEstadoPlaqueta);
}

async function buscarItemPorPatrimonio() {
  await buscarItemImportadoPorPatrimonio(
    itemColetado.value.patrimonio,
    idInventario.value
  );
  if (itemImportado.value) {
    itemColetado.value.descricao = itemImportado.value.descricao;
    itemColetado.value.setor = itemImportado.value.setor;
    await dependenciasStore.buscarDependencias(itemImportado.value.setor.id);
    itemColetado.value.dependencia = itemImportado.value.dependencia;
  } else {
    Notify.create({
      color: "red",
      message: `Patrimônio não encontrado!`,
    });
  }
}
async function onSubmit() {
  const item = {
    ...itemColetado,
    idInventario: idInventario.value,
  };
  if (isModoEdicao.value) {
    try {
      item.id = itemColetado.value.id;
      item.idItem = itemColetado.value.item;
      await itensColetadosStore.editItemColetado(item.id, item);
      router.go(-1);
    } catch (error) {}
  } else {
    item.idItem = !!itemImportado.value ? itemImportado.value.id : 0;
    item.usuario = usuario.value.id;
    // }
    const response = await itensColetadosStore.addItemColetado(item);
    if (response && response.status === 200) {
      $q.dialog({
        title: `Item cadastrado`,
        message: `Deseja cadastrar um novo item?`,
        ok: { type: "button", label: "Confirmar", color: "green" },
        cancel: { type: "button", label: "Cancelar", color: "primary" },
      })
        .onOk(() => {
          limparItemColetado();
        })
        .onCancel(() => {
          router.go(-1);
        });
    } else if (response && response.status === 400) {
      Notify.create({
        color: "red",
        message: `${response.data}`,
      });
    }
  }
}

async function onDecode(data) {
  if (!!data) {
    patrimonio.value = await data;
    await buscarItemPorPatrimonio();
    mostrarCamera.value = false;
  }
}

const limparItemColetado = () => {
  itemColetadoObj.patrimonio = null;
  itemColetadoObj.identificador = null;
  itemColetadoObj.descricao = null;
  setor.value = null;
  dependencia.value = null;
  itemColetadoObj.localizacao = null;
  itemColetadoObj.idSituacao = null;
  itemColetadoObj.idEstadoPlaqueta = null;
  itemColetadoObj.observacao = null;
};
</script>

<style lang="sass">

.q-btn:first
  min-width: 5rem
</style>
