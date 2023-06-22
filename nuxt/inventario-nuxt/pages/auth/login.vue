<script setup>
import { Notify } from 'quasar';
import moment from 'moment';

const usuarioForm = ref('');
const senha = ref('');
const router = useRouter();
const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);
const { logar } = authStore;

definePageMeta({
  name: 'login',
  layout: 'login',
});

async function onLogar() {
  if (!usuarioForm.value || !senha.value) return;

  const data = { username: usuarioForm.value, password: senha.value };
  try {
    await logar(data);
    if (authStore.isUsuarioLogado) {
      const lastUrl = JSON.parse(sessionStorage.getItem('lastUrl'));
      const lastUrlFull = lastUrl
        ? { path: lastUrl.path, query: lastUrl.query }
        : { path: '/inventario' };
      router.replace(lastUrlFull);
      Notify.create({
        color: 'green',
        message: `Bem vindo de volta, ${
          usuario.value.nome
        }! Sua sessão expira em ${moment(usuario.value.dataExt).format(
          'DD/MM/YYYY HH:mm a.'
        )}`,
        timeout: 5000,
      });
    }
  } catch (error) {
    let message = error.message;
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          message = 'Usuário ou senha inválidos!';
          break;
        default:
          message = 'Erro desconhecido!';
          break;
      }
    }

    Notify.create({
      icon: 'report',
      color: 'red',
      message,
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
                v-model="usuarioForm"
                outlined
                clearable
                type="text"
                label="Usuário"
              />
              <q-input
                v-model="senha"
                outlined
                clearable
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
