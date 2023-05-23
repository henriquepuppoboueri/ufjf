<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

const usuarioForm = ref("");
const senha = ref("");
const router = useRouter();
const authStore = useAuthStore();
// const { usuario } = storeToRefs(authStore);
const { logar } = authStore;

async function onLogar() {
  if (!usuarioForm.value || !senha.value) return;

  const data = { username: usuarioForm.value, password: senha.value };
  try {
    await logar(data);
    if (authStore.isUsuarioLogado) {
      router.push("/inventario");
      Notify.create({
        color: "green",
        message: `Bem vindo de volta!`,
      });
    }
  } catch (error) {
    Notify.create({
      icon: "report",
      color: "red",
      message: `${error}`,
    });
  }
}
</script>

<template>
  <q-page class="bg-red-1 row flex-center">
    <div class="column">
      <div class="row">
        <q-form @submit.prevent="onLogar">
          <q-card bordered class="q-pa-md shadow-1">
            <q-card-section class="q-gutter-md">
              <p class="text-grey-6">Entre com suas credenciais</p>
              <q-input
                outlined
                clearable
                v-model="usuarioForm"
                type="text"
                label="Usuário"
              />
              <q-input
                outlined
                clearable
                v-model="senha"
                type="password"
                label="Senha"
              />
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn
                unelevated
                color="primary"
                size="lg"
                class="full-width"
                label="Entrar"
                :disable="!usuarioForm || !senha"
                type="submit"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none"> </q-card-section>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-page>
</template>
