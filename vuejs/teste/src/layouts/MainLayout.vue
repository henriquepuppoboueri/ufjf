<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="flex flex-center">
          Controle de Inventário - UFJF
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-pa-sm" style="max-width: 350px">
        <q-list class="rounded-borders">
          <q-item class="q-mb-sm" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Henrique Puppo Boueri</q-item-label>
              <q-item-label caption lines="1"
                >henrique.puppo@ufjf.br</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-expansion-item
            expand-separator
            icon="fa-solid fa-user"
            label="Usuários"
            caption="Controle de usuários"
            :content-inset-level="0.5"
          >
            <q-item clickable v-ripple to="/usuario/novo">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-user-plus" />
              </q-item-section>

              <q-item-section>Novo usuário</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-user-pen" />
              </q-item-section>

              <q-item-section>Visualizar/editar</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="fa-solid fa-building"
            label="Unidades e dependências"
            caption="Unidades e dependências"
            :content-inset-level="0.5"
          >
            <q-item clickable v-ripple to="/unidade/novo">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-plus" />
              </q-item-section>

              <q-item-section>Nova unidade</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-pen-to-square" />
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
            <q-item clickable v-ripple to="/inventario/novo">
              <q-item-section avatar>
                <q-icon
                  text-color="white"
                  name="fa-solid fa-file-circle-plus"
                />
              </q-item-section>

              <q-item-section>Novo inventário</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-book-open" />
              </q-item-section>

              <q-item-section>Visualizar/editar</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="fa-solid fa-receipt"
            label="Relatórios"
            caption="Emissão de relatórios"
          >
          </q-expansion-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
