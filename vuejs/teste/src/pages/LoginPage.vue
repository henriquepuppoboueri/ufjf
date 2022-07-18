<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

const usuario = ref("puppo");
const senha = ref("33");
const router = useRouter();
const authStore = useAuthStore();

async function logar() {
  if (!usuario.value || !senha.value) return;

  const data = { username: usuario.value, password: senha.value };
  const { logar } = useAuthStore();
  await logar(data);
  if (authStore.usuario) {
    router.push("/inventario");
  }
}
</script>

<template>
  <q-page class="bg-red-1 row flex-center">
    <div class="column">
      <div class="row">
        <q-form @submit="logar">
          <q-card bordered class="q-pa-md shadow-1">
            <q-card-section class="q-gutter-md">
              <p class="text-grey-6">Entre com suas credenciais</p>
              <q-input
                outlined
                clearable
                v-model="usuario"
                type="text"
                label="Usuário"
              />
              <!-- <q-input
                outlined
                clearable
                v-model="email"
                type="email"
                label="E-mail"
                suffix="@ufjf.br"
              /> -->
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
                :disable="!usuario || !senha"
                type="submit"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
              <!-- <p class="text-grey-6">Esqueceu a senha? Clique aqui</p> -->
            </q-card-section>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-page>
</template>
