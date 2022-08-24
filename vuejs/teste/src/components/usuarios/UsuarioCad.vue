<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit" class="q-gutter-sm">
      <q-input
        stack-label
        type="e-mail"
        outlined
        v-model="usuarioTemp.email"
        label="E-mail (@ufjf.br)"
        :disable="isModoEdicao"
        :rules="[(v) => v.includes('@ufjf.br') || 'E-mail não pertence à UFJF']"
      />
      <q-input stack-label outlined v-model="usuarioTemp.nome" label="Nome" />
      <q-input stack-label outlined v-model="usuarioTemp.login" label="Login" />
      <div v-if="!isModoEdicao" class="q-gutter-y-sm">
        <q-separator></q-separator>
        <q-input
          type="password"
          outlined
          v-model="senha"
          label="Senha"
          stack-label
        />
        <q-input
          type="password"
          outlined
          v-model="senhaConfirmacao"
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
      const response = await usuariosStore.editUsuario(
        id.value,
        usuarioTemp.value
      );
      Notify.create({ color: "green", message: "Usuário atualizado!" });
      router.push({ path: "/usuario" });
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

// temporário, até arrumar a API
// watch(usuario, (nv) => {
//   if (!isModoEdicao.value) {
//     usuario.login = nv.email.split("@")[0];
//     const nomeSeparado = nv.login.split(".").map((palavra) => {
//       if (palavra && typeof palavra === "string")
//         return `${palavra[0].toUpperCase()}${palavra.slice(1)}`;
//     });
//     usuario.nome = nomeSeparado.join(" ");
//   }
// });
</script>
