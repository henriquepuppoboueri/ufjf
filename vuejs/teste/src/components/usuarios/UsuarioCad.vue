<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-input
        type="e-mail"
        outlined
        v-model="usuario.email"
        label="E-mail (@ufjf.br)"
        :disable="isModoEdicao"
        :rules="[
          (value) => value.includes('@ufjf.br') || 'E-mail não pertence à UFJF',
        ]"
      />
      <q-input outlined v-model="usuario.nome" disable label="Nome" />
      <q-input outlined v-model="usuario.login" disable label="Login" />

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
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify } from "quasar";
import { useUsuariosStore } from "stores/usuarios";

const usuariosStore = useUsuariosStore();
const isModoEdicao = ref(false);
const router = useRouter();
const route = useRoute();
const id = ref(null);
const usuario = reactive({
  nome: "",
  email: "",
  cpf: `${Math.floor(Math.random() * 99999999999)}`,
  id: 0,
  login: "",
  senha: "123456",
  nascimento: "",
});
const isBtnEnabled = computed(() => {
  return usuario.email.includes("@ufjf.br");
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
    const response = await usuariosStore.buscarUsuario(id.value);
    Object.assign(usuario, response.data);
  }
});

async function onSubmit() {
  if (isModoEdicao.value) {
    try {
      const response = await usuariosStore.editUsuario(id.value, usuario);
      Notify.create({ color: "green", message: "Usuário atualizado!" });
      router.push({ path: "/usuario" });
    } catch (err) {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    }
  } else {
    // novo, então
    try {
      const response = await usuariosStore.addUsuario(usuario);
      Notify.create({ color: "green", message: "Usuário cadastrado!" });
      router.push({ path: "/usuario" });
    } catch (err) {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    }
  }
}

// temporário, até arrumar a API
watch(usuario, (nv) => {
  if (!isModoEdicao.value) {
    usuario.login = nv.email.split("@")[0];
    const nomeSeparado = nv.login.split(".").map((palavra) => {
      if (palavra && typeof palavra === "string")
        return `${palavra[0].toUpperCase()}${palavra.slice(1)}`;
    });
    usuario.nome = nomeSeparado.join(" ");
  }
});
</script>
