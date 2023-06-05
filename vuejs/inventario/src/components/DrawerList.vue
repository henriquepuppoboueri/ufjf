<script setup>
import { useAuthStore } from "src/stores/auth";

const { usuario } = useAuthStore();
</script>

<template>
  <q-expansion-item
    v-if="usuario.adminSistema"
    expand-separator
    icon="fa-solid fa-user"
    label="Usuários"
    caption="Controle de usuários"
    :content-inset-level="0.5"
  >
    <q-item v-ripple dense clickable to="/usuario/novo" exact>
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-user-plus" />
      </q-item-section>

      <q-item-section>Novo usuário</q-item-section>
    </q-item>

    <q-item v-ripple dense clickable to="/usuario" exact>
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
    <q-item v-ripple dense clickable to="/inventario/novo" exact>
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-file-circle-plus" />
      </q-item-section>

      <q-item-section>Novo inventário</q-item-section>
    </q-item>

    <q-item v-ripple dense :to="{ name: 'inventarioIndex' }" exact clickable>
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
    <q-item v-ripple dense clickable to="/ferramentas/importar">
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-upload" />
      </q-item-section>

      <q-item-section>Importar arquivo do SIGA</q-item-section>
    </q-item>
    <q-item v-ripple dense clickable to="/ferramentas/etiquetas">
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-tag" />
      </q-item-section>

      <q-item-section>Imprimir etiquetas</q-item-section>
    </q-item>
    <q-item v-ripple dense clickable to="/ferramentas/config">
      <q-item-section avatar>
        <q-icon text-color="white" name="fa-solid fa-gear" />
      </q-item-section>

      <q-item-section>Configurações (por dispositivo)</q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<style scoped></style>
