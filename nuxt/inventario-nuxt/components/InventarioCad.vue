<script setup>
import { Notify } from 'quasar';

const inventariosStore = useInventariosStore();
const { inventario } = storeToRefs(inventariosStore);
const { buscarInventario, editInventario, addInventario, $initInventario } =
  inventariosStore;
const statusAtual = ref({ id: 1, nome: 'Preparando' });

const idInventario = computed(() => {
  const { id } = useRoute().params;
  return id;
});

const isModoEdicao = computed(() => {
  return !!idInventario.value;
});

onBeforeMount(async () => {
  if (isModoEdicao.value) await buscarInventario(idInventario.value);
  else {
    $initInventario();
  }
});

async function onSubmit() {
  if (isModoEdicao.value) {
    try {
      await editInventario(idInventario.value, inventario.value);
      Notify.create({ color: 'green', message: 'Inventário atualizado!' });
      navigateTo('/inventario');
    } catch (err) {
      Notify.create({ color: 'red', message: `Erro: ${err}` });
    }
  } else {
    try {
      await addInventario(inventario.value);
      Notify.create({ color: 'green', message: 'Inventário criado!' });
      navigateTo('/inventario');
    } catch (err) {
      Notify.create({ color: 'red', message: `Erro: ${err}` });
    }
  }
}
</script>

<template>
  <div class="q-pa-sm">
    <q-form v-if="inventario" class="q-gutter-sm" @submit.prevent="onSubmit">
      <q-input v-model="inventario.nome" outlined label="Nome do inventário" />
      <q-input
        v-model="statusAtual.nome"
        standout
        outlined
        disable
        readonly
        label="Status do inventário"
      />

      <q-editor
        v-model="inventario.descricao"
        min-height="5rem"
        placeholder="Descrição"
      />
      <div>
        <q-btn
          :disabled="!inventario.nome"
          dense
          label="Enviar"
          type="submit"
          color="green"
        />
        <q-btn
          dense
          label="Voltar"
          type="reset"
          color="primary"
          class="q-ml-sm"
          @click="navigateTo('/inventario')"
        />
      </div>
    </q-form>
  </div>
</template>
