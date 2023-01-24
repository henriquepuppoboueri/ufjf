<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <p class="text-center text-h4">Alteração de senha</p>
      <!-- <q-separator /> -->
      <q-input
        type="password"
        outlined
        v-model="novaSenha"
        label="Inserir nova senha"
      />
      <q-input
        type="password"
        outlined
        v-model="novaSenhaConfirmacao"
        label="Repetir nova senha"
      />

      <div>
        <q-btn
          :disabled="desabilitaBtnSalvar"
          dense
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
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const novaSenha = ref("");
const { usuario } = storeToRefs(authStore);
const novaSenhaConfirmacao = ref("");
const usuariosStore = useUsuariosStore();
const isModoEdicao = ref(false);
const router = useRouter();
const route = useRoute();
const id = ref(null);

const desabilitaBtnSalvar = computed(() => {
  return (
    novaSenhaConfirmacao.value === "" ||
    novaSenha.value === "" ||
    novaSenhaConfirmacao.value !== novaSenha.value
  );
});

onMounted(async () => {});

async function onSubmit() {
  try {
    const response = await authStore.trocarSenha(
      usuario.value.id,
      usuario.value.login,
      novaSenhaConfirmacao.value
    );
    Notify.create({ color: "green", message: "Senha atualizada!" });
    router.push({ path: "/" });
  } catch (err) {
    Notify.create({ color: "red", message: `Erro: ${err}` });
  }
}
</script>
