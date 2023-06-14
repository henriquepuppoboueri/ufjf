<script setup>
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { usuario } = storeToRefs(authStore);

const timer = useCountdownTimer(usuario.value?.dataExt);
</script>

<template>
  <q-item>
    <q-item-section class="col-grow">
      <q-tooltip>
        {{ usuario.versaoAPI }}
      </q-tooltip>
      <q-item-label>{{ usuario ? usuario.nome : 'Visitante' }}</q-item-label>
      <q-item-label caption class="text-blue">
        {{ usuario ? usuario.email : '' }}
      </q-item-label>
      <q-item-label class="text-italic" caption>
        Sessão expira em: {{ timer }}
      </q-item-label>
      <q-item-label caption>
        <q-btn
          :to="'/senha'"
          size="sm"
          dense
          class="q-pa-none"
          flat
          color="blue"
          label="Alterar senha"
        />
      </q-item-label>
    </q-item-section>
    <q-item-section class="col-auto">
      <q-btn
        :to="{
          path: '/auth/logout',
        }"
        size="md"
        dense
        icon="fa-solid fa-door-open"
        class="q-pa-none"
        flat
        color="primary"
        label="Sair"
      />
    </q-item-section>
  </q-item>
</template>

<style scoped></style>
