<template>
  <div class="q-pa-md">
    <q-form class="q-gutter-sm" @submit.prevent="onSubmit">
      <q-input
        v-model="usuarioTemp.email"
        stack-label
        type="e-mail"
        outlined
        label="E-mail (@ufjf.br)"
        :disable="isModoEdicao"
        :rules="[(v) => v.includes('@ufjf.br') || 'E-mail não pertence à UFJF']"
      />
      <q-input v-model="usuarioTemp.nome" stack-label outlined label="Nome" />
      <q-input v-model="usuarioTemp.login" stack-label outlined label="Login" />
      <div v-if="!isModoEdicao" class="q-gutter-y-sm">
        <q-separator></q-separator>
        <q-input
          v-model="senha"
          type="password"
          outlined
          label="Senha"
          stack-label
        />
        <q-input
          v-model="senhaConfirmacao"
          type="password"
          outlined
          label="Repetir senha"
          stack-label
        />
      </div>

      <div>
        <q-btn
          dense
          :disabled="!isBtnEnabled"
          label="Salvar"
          type="submit"
          color="green"
        />
        <q-btn
          dense
          label="Voltar"
          type="reset"
          color="primary"
          class="q-ml-sm"
          to="/usuario"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify } from "quasar";
import { useUsuariosStore } from "stores/usuarios";
import { storeToRefs } from "pinia";

const usuariosStore = useUsuariosStore();
const { usuario } = storeToRefs(usuariosStore);
const isModoEdicao = ref(false);
const router = useRouter();
const route = useRoute();
const id = ref(null);
const senha = ref(null);
const senhaConfirmacao = ref(null);

const usuarioTemp = ref({
  nome: "",
  email: "",
  cpf: `${Math.floor(Math.random() * 99999999999)}`,
  id: 0,
  login: "",
  senha: "",
  nascimento: "",
});

const isBtnEnabled = computed(() => {
  if (!isModoEdicao.value) {
    return (
      usuarioTemp.value.email.includes("@ufjf.br") &&
      senha.value === senhaConfirmacao.value &&
      !!senha.value
    );
  } else {
    return true;
  }
});

onMounted(async () => {
  if (
    route.params.hasOwnProperty("id") &&
    typeof +route.params.id === "number"
  ) {
    id.value = route.params.id;
    isModoEdicao.value = id.value !== 0;
  }

  if (isModoEdicao.value) {
    await usuariosStore.buscarUsuario(id.value);
    Object.assign(usuarioTemp.value, usuario.value);
  }
});

async function onSubmit() {
  if (isModoEdicao.value) {
    try {
      const { status } = await usuariosStore.editUsuario(
        id.value,
        usuarioTemp.value
      );
      if (status === 200) {
        Notify.create({ color: "green", message: "Usuário atualizado!" });
        router.push({ path: "/usuario" });
      }
    } catch (err) {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    }
  } else {
    // novo, então
    try {
      const response = await usuariosStore.addUsuario({
        ...usuarioTemp.value,
        senha: senha.value,
      });
      Notify.create({ color: "green", message: "Usuário cadastrado!" });
      router.push({ path: "/usuario" });
    } catch (err) {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    }
  }
}
</script>
