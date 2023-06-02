<template>
  <q-dialog ref="dialogRef" :persistent="true" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div class="row q-gutter-x-sm justify-between no-wrap">
        <q-input
          v-model="patrimonio"
          outlined
          label="Patrimônio"
          dense
          class="fit"
          type="number"
        />
        <q-btn
          color="blue"
          label="Buscar"
          type="button"
          :disabled="!patrimonio"
          @click="buscarItemPatrimonio"
        />
      </div>
      <q-card-actions>
        <q-btn
          dense
          color="green"
          label="Vincular"
          :disabled="!itemImportado || !itemImportado.patrimonio"
          @click="onOKClick"
        />
        <q-btn dense color="red" label="Cancelar" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  {{ erro }}
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from "vue";
import { useDialogPluginComponent, Notify } from "quasar";
import { useItensImportadosStore } from "src/stores/itensImportados";
import { storeToRefs } from "pinia";
import { useItensColetadosStore } from "src/stores/itensColetados";

const props = defineProps({
  idInventario: { type: String, required: true },
  idItemColetado: { type: String, required: true },
  // ...your custom props
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const itensImportadosStore = useItensImportadosStore();
const { itemImportado } = storeToRefs(itensImportadosStore);
const { buscarItemImportadoPorPatrimonio } = itensImportadosStore;

const itensColetadosStore = useItensColetadosStore();
const { erro } = storeToRefs(itensColetadosStore);
const { vincularItemPatrimonio } = itensColetadosStore;

const patrimonio = ref("");

async function buscarItemPatrimonio() {
  await buscarItemImportadoPorPatrimonio(patrimonio.value, props.idInventario);
  if (itemImportado.value) {
    Notify.create({
      color: "green",
      message: `Patrimônio encontrado!`,
    });
  } else
    Notify.create({
      color: "red",
      message: `Patrimônio não encontrado!`,
    });
}

watch(patrimonio, (_) => {
  itensImportadosStore.$reset();
});

onMounted(() => {
  itensImportadosStore.$reset();
});

onUnmounted(() => {
  itensImportadosStore.$reset();
});
async function onOKClick() {
  await vincularItemPatrimonio(props.idItemColetado, itemImportado.value.id);
  if (erro.value) {
    console.log(erro);
    Notify.create({
      color: "red",
      message: `${erro.value.response.data}`,
    });
  } else {
    console.log("Não deu erro");
    Notify.create({
      color: "green",
      message: `Patrimônio vinculado!`,
    });

    // on OK, it is REQUIRED to
    // call onDialogOK (with optional payload)

    onDialogOK();
    // or with payload: onDialogOK({ ... })
    // ...and it will also hide the dialog automatically
  }
}

function onCancelClick() {
  // itensImportadosStore.$reset();

  onDialogCancel();
}
</script>

<style scoped></style>
