<template>
  <div class="q-pa-sm">
    <q-form @submit.prevent="onSubmit" class="q-gutter-sm">
      <q-input outlined v-model="inventario.nome" label="Nome do inventário" />
      <q-input
        standout
        outlined
        disable
        readonly
        v-model="statusAtual.nome"
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
          @click="router.go(-1)"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { date, Notify } from "quasar";
import { useInventariosStore } from "src/stores/inventarios";

const inventariosStore = useInventariosStore();
const modoEdicao = ref(false);
const inventario = reactive({ nome: "", descricao: "" });
const idInventario = ref(null);
const route = useRoute();
const router = useRouter();
const dataCriacao = ref("30/06/2022");
const statusAtual = ref({ id: 1, nome: "Preparando" });
const statusOpcoes = reactive([
  { id: 1, nome: "Preparando" },
  { id: 2, nome: "Inventariando" },
  { id: 3, nome: "Suspenso" },
  { id: 4, nome: "Fechado" },
]);

onMounted(async () => {
  if ("id" in route.params) {
    // modo de edição
    modoEdicao.value = true;
    idInventario.value = +route.params.id;

    await inventariosStore.buscarInventario(idInventario.value);
    Object.assign(inventario, inventariosStore.inventario);
  } else {
    return;
  }
});

async function onSubmit() {
  if (modoEdicao.value) {
    try {
      await inventariosStore.editInventario(idInventario.value, inventario);
      Notify.create({ color: "green", message: "Inventário atualizado!" });
      router.go(-1);
    } catch (err) {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    }
  } else {
    try {
      await inventariosStore.addInventario(inventario);
      Notify.create({ color: "green", message: "Inventário criado!" });
      router.go(-1);
    } catch (err) {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    }
  }
}
</script>
