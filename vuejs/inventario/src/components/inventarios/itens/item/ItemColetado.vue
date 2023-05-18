<script setup>
import { ref, onUnmounted, computed, onMounted, watch } from "vue";
import { useItensColetadosStore } from "src/stores/itensColetados";
import { useSetoresStore } from "src/stores/setores";
import { useItensImportadosStore } from "src/stores/itensImportados";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSituacaoStore } from "src/stores/situacao";
import { usePlaquetaStore } from "src/stores/plaqueta";
import { useAuthStore } from "src/stores/auth";
import { isNumber, notStartWith } from "src/helper/formValidation";
import { Notify, useQuasar } from "quasar";
import { QrStream } from "vue3-qr-reader";

const $q = useQuasar();
const mostrarCamera = ref("");
const router = useRouter();
// stores
const authStore = useAuthStore();
const plaquetaStore = usePlaquetaStore();
const situacaoStore = useSituacaoStore();
const setoresStore = useSetoresStore();
const itensColetadosStore = useItensColetadosStore();
const itensImportadosStore = useItensImportadosStore();

const route = useRoute();

const { setoresDependencias } = storeToRefs(setoresStore);
const { situacoes } = storeToRefs(situacaoStore);
const { estadosPlaquetas } = storeToRefs(plaquetaStore);
const { itemImportado } = storeToRefs(itensImportadosStore);
const { buscarItemImportadoPorPatrimonio } = itensImportadosStore;
const { itemColetado, itemNominal, erro } = storeToRefs(itensColetadosStore);
const { limparItemColetado } = itensColetadosStore;
const { usuario } = storeToRefs(authStore);
const isModoEdicao = ref(false);
const idInventario = ref(null);
const dependencias = ref([]);
const pularWatch = ref(false);
const routeUrl = computed(
  () => `/inventario/v/${idInventario.value}/itens/coletados`
);
const desabilitaSalvar = computed(() => {
  return 0;
});

onMounted(async () => {
  const idItem = +route.params.idItem;
  idInventario.value = +route.params.idInventario;
  isModoEdicao.value = !!idItem;
  itemColetado.value.idItem = 0;

  await situacaoStore.buscarSituacoes();
  await plaquetaStore.buscarEstadosPlaquetas();
  await setoresStore.buscarSetoresDependencias(idInventario.value);

  if (isModoEdicao.value) await montaFormEditar(idItem);
  else {
    // limparItemColetado();
  }
});

onUnmounted(() => {
  itensColetadosStore.$reset();
  // limparItemColetado();
});

// itensColetadosStore.$subscribe((mutation, state) => {
//   console.log(state);
// });

watch(
  () => itemColetado.value.setor,
  (newV, oldV) => {
    if (!isModoEdicao.value && !pularWatch.value)
      itemColetado.value.dependencia = null;
    if (newV) {
      const deps = setoresDependencias.value.filter(
        (setor) => setor.id === newV.id
      )[0];
      if (deps) {
        dependencias.value = deps["dependencias"];
      }
    }
  }
);

function onMostrarCamera(campo) {
  mostrarCamera.value === ""
    ? (mostrarCamera.value = campo)
    : (mostrarCamera.value = "");
}

async function montaFormEditar(idItem) {
  await itensColetadosStore.buscarItemColetado(idItem);
  await situacaoStore.buscarSituacao(itemColetado.value.situacao);
  await plaquetaStore.buscarEstadoPlaqueta(itemColetado.value.idEstadoPlaqueta);
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
      color: "red",
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
      const response = await itensColetadosStore.editItemColetado(
        item.id,
        item
      );
      if (!!erro.value) {
        $q.notify({ message: erro.value, color: "red", icon: "warning" });
      } else {
        router.replace({
          path: routeUrl.value,
        });
        Notify.create({
          type: "info",
          message: "Item atualizado.",
          color: "green",
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    item.idItem = !!itemImportado.value ? itemImportado.value.id : 0;
    item.usuario = usuario.value.id;

    const response = await itensColetadosStore.addItemColetado(item);
    if (response && response.status === 200) {
      $q.dialog({
        title: `Item cadastrado`,
        message: `Deseja cadastrar um novo item?`,
        ok: { type: "button", label: "Confirmar", color: "green" },
        cancel: { type: "button", label: "Cancelar", color: "primary" },
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
        color: "red",
        message: `${response.data}`,
      });
    }
  }
}

async function onDecode(data) {
  if (!!data) {
    if (mostrarCamera.value === "patrimonio") {
      patrimonio.value = await data;
      await buscarItemPorPatrimonio();
    } else if (mostrarCamera.value === identificador) {
      identificador.value = await data;
    }
    mostrarCamera.value = "";
  }
}
</script>

<template>
  <div v-if="mostrarCamera">
    <qr-stream @decode="onDecode"></qr-stream>
  </div>
  <q-form @submit.prevent="onSubmit">
    <section class="col q-ma-sm q-gutter-y-sm" v-if="itemColetado">
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
          :color="mostrarCamera === 'patrimonio' ? 'red' : 'green'"
          icon="fa-solid fa-camera"
          type="button"
          @click="onMostrarCamera('patrimonio')"
          v-if="!isModoEdicao"
        />
      </div>
      <div class="row q-gutter-x-sm justify-between no-wrap">
        <q-input
          class="fit"
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
        <q-btn
          :style="{ maxHeight: '40px' }"
          class="btn_camera"
          :color="mostrarCamera === 'identificador' ? 'red' : 'green'"
          icon="fa-solid fa-camera"
          type="button"
          @click="onMostrarCamera('identificador')"
          v-if="!isModoEdicao"
        />
      </div>
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
        v-if="itemColetado.setor"
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
      <q-btn
        dense
        color="primary"
        label="Cancelar"
        @click="router.replace(routeUrl)"
      />
    </section>
  </q-form>
</template>
<style lang="sass">

.q-btn:first
  min-width: 5rem
</style>
