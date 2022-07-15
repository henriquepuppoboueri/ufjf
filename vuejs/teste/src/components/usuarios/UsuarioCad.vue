<template>
  <div class="q-pa-md">
    <!-- <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md"> -->
    <q-form class="q-gutter-md">
      <q-input outlined v-model="nome" label="Nome de usuário" />

      <q-input
        type="e-mail"
        outlined
        v-model="email"
        label="E-mail (@ufjf.br)"
      />

      <div>
        <q-btn label="Salvar" type="submit" color="primary" />
        <q-btn
          label="Voltar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          to="/usuario"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const isModoEdicao = ref(false);
const route = useRoute();
const nome = ref("");
const email = ref("");
const usuario = reactive(null);
const id = ref(null);

onMounted(() => {
  // modo.value = !!+route.params.id;

  if (
    route.params.hasOwnProperty("id") &&
    typeof +route.params.id === "number"
  ) {
    id.value = route.params.id;
    isModoEdicao.value = id.value !== 0;
  }

  if (isModoEdicao.value) {
    api.get(`v1/restrito/usuarios/${id.value}`).then((res) => {
      usuario = res.data;
    });
  }
});
</script>
