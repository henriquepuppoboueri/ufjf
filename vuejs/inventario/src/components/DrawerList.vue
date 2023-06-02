<script setup>
import { useAuthStore } from "src/stores/auth";

const { usuario } = useAuthStore();
</script>

<template>
  <q-expansion-item
    expand-separator
    icon="fa-solid fa-user"
    label="Usuários"
    caption="Controle de usuários"
    :content-inset-level="0.5"
    v-if="usuario.adminSistema"
  >
    <q-item dense clickable v-ripple to="/usuario/novo" exact>
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-user-plus" />
      </q-item-section>

      <q-item-section>Novo usuário</q-item-section>
    </q-item>

    <q-item dense clickable v-ripple to="/usuario" exact>
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-user-pen" />
      </q-item-section>

      <q-item-section>Visualizar/editar</q-item-section>
    </q-item>
  </q-expansion-item>

  <q-expansion-item
    expand-separator
    icon="fa-solid fa-book"
    label="Inventários"
    caption="Controle de Inventários"
    :content-inset-level="0.5"
  >
    <q-item dense clickable v-ripple to="/inventario/novo" exact>
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-file-circle-plus" />
      </q-item-section>

      <q-item-section>Novo inventário</q-item-section>
    </q-item>

    <q-item dense :to="{ name: 'inventario' }" exact clickable v-ripple>
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-book-open" />
      </q-item-section>

      <q-item-section>Visualizar/editar</q-item-section>
    </q-item>
  </q-expansion-item>

  <q-expansion-item
    expand-separator
    icon="fa-solid fa-gear"
    label="Ferramentas"
    caption="Importação de arquivos"
    :content-inset-level="0.5"
  >
    <q-item dense clickable v-ripple to="/ferramentas/importar">
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-upload" />
      </q-item-section>

      <q-item-section>Importar arquivo do SIGA</q-item-section>
    </q-item>
    <q-item dense clickable v-ripple to="/ferramentas/etiquetas">
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-tag" />
      </q-item-section>

      <q-item-section>Imprimir etiquetas</q-item-section>
    </q-item>
    <q-item dense clickable v-ripple to="/ferramentas/config">
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-gear" />
      </q-item-section>

      <q-item-section>Configurações (por dispositivo)</q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<style scoped></style>
