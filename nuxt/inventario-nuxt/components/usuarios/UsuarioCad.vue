<script setup>
import { ref, computed } from 'vue';

import { Notify } from 'quasar';

const usuariosStore = useUsuariosStore();
const { usuario, erro, carregando } = storeToRefs(usuariosStore);
const { $resetUsuario } = usuariosStore;
const isModoEdicao = ref(false);
const route = useRoute();
const senhaConfirmacao = ref(null);
const isPwd = ref(true);

const isBtnEnabled = computed(() => {
  if (!isModoEdicao.value) {
    return (
      usuario.value.email.includes('@ufjf.br') &&
      usuario.value.senha === senhaConfirmacao.value
    );
  } else {
    return true;
  }
});

onBeforeMount(async () => {
  const { id } = route.params;

  if (!id) {
    return;
  }

  isModoEdicao.value = id !== 'adicionar';

  if (isModoEdicao.value) {
    try {
      await usuariosStore.buscarUsuario(id);
    } catch (error) {
      erro.value = error;
    }
  } else {
    usuario.value = {
      id: 0,
      nome: '',
      login: '',
      senha: '',
      email: '',
      nascimento: '',
    };
  }
});

onUnmounted(() => {
  $resetUsuario();
});

async function onSubmit() {
  if (isModoEdicao.value) {
    try {
      const { status } = await usuariosStore.editUsuario(
        usuario.value.id,
        usuario.value,
        { raw: true }
      );

      if (status === 200) {
        Notify.create({ color: 'green', message: 'Usuário atualizado!' });
        navigateTo({ path: '/usuario' });
      }
    } catch (err) {
      Notify.create({ color: 'red', message: `Erro: ${err}` });
    }
  } else {
    // novo, então
    try {
      const response = await usuariosStore.addUsuario(usuario.value);
      Notify.create({ color: 'green', message: 'Usuário cadastrado!' });
      navigateTo({ path: '/usuario' });
    } catch (err) {
      Notify.create({ color: 'red', message: `Erro: ${err}` });
    }
  }
}
</script>

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-center text-h5">
        {{ isModoEdicao ? 'Editar' : 'Cadastrar' }} usuário
      </div>
    </q-card-section>
    <q-card-section v-if="erro"> {{ erro }} </q-card-section>
    <q-card-section v-if="usuario && !erro && !carregando">
      <q-form class="q-gutter-sm">
        <q-input
          v-model="usuario.email"
          stack-label
          type="e-mail"
          outlined
          label="E-mail (@ufjf.br)"
          :disable="isModoEdicao"
          :rules="[
            (v) => v.includes('@ufjf.br') || 'E-mail não pertence à UFJF',
          ]"
        />
        <q-input v-model="usuario.nome" stack-label outlined label="Nome" />
        <q-input v-model="usuario.login" stack-label outlined label="Login" />
        <div v-if="!isModoEdicao" class="q-gutter-y-sm">
          <q-separator></q-separator>
          <q-input
            v-model="usuario.senha"
            type="password"
            outlined
            label="Senha"
            stack-label
            :autocomplete="usuario.senha"
            :type="!isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="senhaConfirmacao"
            type="password"
            outlined
            label="Repetir senha"
            stack-label
            :autocomplete="senhaConfirmacao"
            :type="!isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions v-if="usuario && !erro && !carregando" class="q-ml-sm">
      <q-btn
        dense
        :disabled="!isBtnEnabled"
        label="Salvar"
        type="submit"
        color="green"
        @click="onSubmit"
      />
      <q-btn
        dense
        label="Voltar"
        type="reset"
        color="primary"
        class="q-ml-sm"
        to="/usuario"
      />
    </q-card-actions>
  </q-card>
  <div class="q-pa-sm"></div>
</template>
