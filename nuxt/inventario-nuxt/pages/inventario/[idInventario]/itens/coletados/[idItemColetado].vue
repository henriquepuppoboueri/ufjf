<script setup>
import { Notify, useQuasar } from 'quasar';
import { StreamBarcodeReader } from 'vue-barcode-reader';

import { isNumber, notStartWith } from '/helper/formValidation';

definePageMeta({ name: 'itemColetado' });

const $q = useQuasar();
const mostrarCamera = ref('');
const router = useRouter();
const route = useRoute();

const setoresStore = useSetoresStore();
const { setoresDependencias } = storeToRefs(setoresStore);
const { buscarSetoresDependencias, buscarSetorPorId } = setoresStore;

const situacaoStore = useSituacaoStore();
const { situacoes } = storeToRefs(situacaoStore);
const { buscarSituacoes, buscarSituacao } = situacaoStore;

const plaquetaStore = usePlaquetaStore();
const { estadosPlaquetas } = storeToRefs(plaquetaStore);
const { buscarEstadosPlaquetas, buscarEstadoPlaqueta } = plaquetaStore;

const itensImportadosStore = useItensImportadosStore();
const { itemImportado } = storeToRefs(itensImportadosStore);
const { buscarItemImportadoPorPatrimonio } = itensImportadosStore;

const itensColetadosStore = useItensColetadosStore();
const { itemColetado, erro } = storeToRefs(itensColetadosStore);
const {
  limparItemColetado,
  buscarItemColetado,
  editItemColetado,
  addItemColetado,
  $reset: $resetItemColetado,
  $novo,
} = itensColetadosStore;

const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);

const isModoEdicao = ref(null);
const idInventario = ref(null);

const setores = computed(() => {
  return setoresDependencias.value.map((setor) => ({
    id: setor.id,
    nome: setor.nome,
  }));
});

const dependencias = computed(() => {
  return setoresDependencias.value.find(
    (setor) => setor.id === itemColetado.value?.idSetor
  )?.dependencias;
});

onBeforeMount(async () => {
  const { idItemColetado, idInventario } = route.params;

  if (!idItemColetado) return;

  isModoEdicao.value = idItemColetado !== 'adicionar';

  await buscarSituacoes();
  await buscarEstadosPlaquetas();
  await buscarSetoresDependencias(idInventario);

  if (isModoEdicao.value) await montaFormEditar(idItemColetado);
  else montaFormAdd();
});

onUnmounted(() => {
  $resetItemColetado();
});

// watch(
//   itemColetado,
//   () => {
//     if (itemColetado.value?.setor?.id) {
//       dependencias.value = setoresDependencias.value.find(
//         (setor) => setor.id === itemColetado.value.setor.id
//       )?.dependencias;
//     }
//   },
//   { deep: true }
// );

function onMostrarCamera(campo) {
  mostrarCamera.value === ''
    ? (mostrarCamera.value = campo)
    : (mostrarCamera.value = '');
}

async function montaFormEditar(idItemColetado) {
  await buscarItemColetado(idItemColetado);
  await buscarSituacao(itemColetado.value.situacao);
  buscarEstadoPlaqueta(itemColetado.value.idEstadoPlaqueta);
}

function montaFormAdd() {
  $novo();
}

async function buscarItemPorPatrimonio() {
  await buscarItemImportadoPorPatrimonio(
    itemColetado.value.patrimonio,
    idInventario.value
  );
  if (itemImportado.value) {
    pularWatch.value = true;
    itemColetado.value.descricao = itemImportado.value.descricao;
    itemColetado.value.setor = itemImportado.value.setor;
    itemColetado.value.dependencia = itemImportado.value.dependencia;
  } else {
    Notify.create({
      color: 'red',
      message: `Patrimônio não encontrado!`,
    });
  }
}
async function onSubmit() {
  const item = {
    ...itemColetado.value,
    idInventario: idInventario.value,
    idSetor: itemColetado.value.setor.id,
    idDependencia: itemColetado.value.dependencia.id,
    idEstadoPlaqueta: itemColetado.value.estadoPlaqueta.id,
    idSituacao: itemColetado.value.situacao_.id,
    identificador: itemColetado.value.identificador,
  };
  item.usuario = usuario.value.id;
  delete item.dependencia;
  delete item.setor;
  delete item.estadoPlaqueta;
  delete item.situacao_;
  delete item.situacao;

  if (isModoEdicao.value) {
    try {
      item.id = itemColetado.value.id;
      item.idItem = itemColetado.value.item;
      const response = await editItemColetado(item.id, item);
      if (!!erro.value) {
        $q.notify({ message: erro.value, color: 'red', icon: 'warning' });
      } else {
        router.replace({
          path: routeUrl.value,
        });
        Notify.create({
          type: 'info',
          message: 'Item atualizado.',
          color: 'green',
        });
      }
    } catch (error) {}
  } else {
    item.idItem = !!itemImportado.value ? itemImportado.value.id : 0;
    item.usuario = usuario.value.id;

    const response = await addItemColetado(item);
    if (response && response.status === 200) {
      $q.dialog({
        title: `Item cadastrado`,
        message: `Deseja cadastrar um novo item?`,
        ok: { type: 'button', label: 'Confirmar', color: 'green' },
        cancel: { type: 'button', label: 'Cancelar', color: 'primary' },
      })
        .onOk(() => {
          limparItemColetado(itemColetado);
        })
        .onCancel(() => {
          router.replace({
            path: routeUrl.value,
          });
        });
    } else if (response && response.status === 400) {
      Notify.create({
        color: 'red',
        message: `${response.data}`,
      });
    }
  }
}

async function onDecode(data) {
  if (!!data) {
    if (mostrarCamera.value === 'patrimonio') {
      itemColetado.value.patrimonio = await data;
      await buscarItemPorPatrimonio();
    } else if (mostrarCamera.value === 'identificador') {
      itemColetado.value.identificador = await data;
    }
    mostrarCamera.value = '';
  }
}
</script>

<template>
  idSetor: {{ itemColetado?.idSetor }}
  <br />
  idDependencia: {{ itemColetado?.idDependencia }}
  <br />
  setores: {{ setores }}
  <br />
  dependencias: {{ dependencias }}
  <div v-if="mostrarCamera" class="camera-container flex flex-center">
    <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
  </div>
  <q-form @submit.prevent="onSubmit">
    <section v-if="itemColetado" class="col q-ma-sm q-gutter-y-sm">
      <div class="row q-gutter-x-sm justify-between no-wrap">
        <q-input
          v-model="itemColetado.patrimonio"
          outlined
          label="Patrimônio"
          dense
          class="fit"
        >
        </q-input>
        <q-btn
          v-if="!isModoEdicao"
          color="blue"
          label="Buscar"
          type="button"
          @click="buscarItemPorPatrimonio"
        />
        <q-btn
          v-if="!isModoEdicao"
          class="btn_camera"
          :color="mostrarCamera === 'patrimonio' ? 'red' : 'green'"
          icon="fa-solid fa-camera"
          type="button"
          @click="onMostrarCamera('patrimonio')"
        />
      </div>
      <div class="row q-gutter-x-sm justify-between no-wrap">
        <q-input
          v-model="itemColetado.identificador"
          class="fit"
          outlined
          label="Identificador"
          dense
          :rules="[
            (val) => isNumber(val, 'Identificador'),
            (val) => notStartWith(val, '0', 'Identificador'),
          ]"
        >
        </q-input>
        <q-btn
          v-if="!isModoEdicao"
          :style="{ maxHeight: '40px' }"
          class="btn_camera"
          :color="mostrarCamera === 'identificador' ? 'red' : 'green'"
          icon="fa-solid fa-camera"
          type="button"
          @click="onMostrarCamera('identificador')"
        />
      </div>
      <q-editor
        v-model="itemColetado.descricao"
        min-height="5rem"
        placeholder="Descrição"
        dense
      />
      <q-select
        v-model="itemColetado.idSetor"
        outlined
        :options="setores"
        :option-label="(setor) => setor.nome"
        :option-value="(setor) => setor.id"
        label="Setor"
        dense
      />
      <q-select
        v-model="itemColetado.idDependencia"
        outlined
        :options="dependencias"
        :option-label="(dependencia) => dependencia.nome"
        :option-value="(dependencia) => dependencia.id"
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
        v-model="itemColetado.situacao_"
        outlined
        :options="situacoes"
        :option-label="(item) => item.nome"
        label="Situação"
        dense
      />
      <q-select
        v-model="itemColetado.estadoPlaqueta"
        outlined
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
        v-model="itemColetado.usuario"
        outlined
        disabled
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
        :disabled="false"
      />
      <q-btn dense color="primary" label="Cancelar" @click="router.back()" />
    </section>
  </q-form>
</template>
<style lang="sass">

.camera-container
  background-color: #c0c0c0


.overlay-element
  clip-path: polygon(0% 0%, 0% 0%, 0% 20%, 0% 20%, 100% 20%, 100% 80%, 0% 80%, 0% 100%, 100% 100%, 100% 0%) !important

.laser
  margin-left: 0% !important
  width: 100% !important


.q-btn:first
  min-width: 5rem
</style>
