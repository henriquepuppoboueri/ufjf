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
      <div class="q-pa-xs" style="max-width: 350px">
        <q-list class="rounded-borders">
          <q-item>
            <q-item-section class="col-grow">
              <q-item-label>{{ nome }}</q-item-label>
              <q-item-label caption> {{ email }} </q-item-label>
            </q-item-section>
            <q-item-section class="col-auto">
              <router-link to="/logout">Sair</router-link>
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
            <q-item dense clickable v-ripple to="/usuario/novo">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-user-plus" />
              </q-item-section>

              <q-item-section>Novo usuário</q-item-section>
            </q-item>

            <q-item dense clickable v-ripple to="/usuario">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-user-pen" />
              </q-item-section>

              <q-item-section>Visualizar/editar</q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- <q-expansion-item
            expand-separator
            icon="fa-solid fa-building"
            label="Setores e dependências"
            caption="Setores e dependências"
            :content-inset-level="0.5"
          >
            <q-item clickable v-ripple to="/setor/novo">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-plus" />
              </q-item-section>

              <q-item-section>Novo setor</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/setor">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-pen-to-square" />
              </q-item-section>

              <q-item-section>Dependências</q-item-section>
            </q-item>
          </q-expansion-item> -->

          <q-expansion-item
            expand-separator
            icon="fa-solid fa-book"
            label="Inventários"
            caption="Controle de Inventários"
            :content-inset-level="0.5"
          >
            <q-item dense clickable v-ripple to="/inventario/novo">
              <q-item-section avatar>
                <q-icon
                  text-color="white"
                  name="fa-solid fa-file-circle-plus"
                />
              </q-item-section>

              <q-item-section>Novo inventário</q-item-section>
            </q-item>

            <q-item dense to="/inventario" clickable v-ripple>
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-book-open" />
              </q-item-section>

              <q-item-section>Visualizar/editar</q-item-section>
            </q-item>
            <!--
            <q-item to="/inventario/items" clickable v-ripple>
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-list" />
              </q-item-section>

              <q-item-section>Items dos inventários</q-item-section>
            </q-item>

            <q-item to="/inventario/coletados" clickable v-ripple>
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-list" />
              </q-item-section>

              <q-item-section>Items coletados</q-item-section>
            </q-item>-->
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="fa-solid fa-gear"
            label="Ferramentas"
            caption="Importação de arquivos"
            :content-inset-level="0.5"
          >
            <q-item dense clickable v-ripple to="/ferramentas">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-upload" />
              </q-item-section>

              <q-item-section>Importar arquivo do SIGA</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="fa-solid fa-receipt"
            label="Relatórios"
            caption="Emissão de relatórios"
            :content-inset-level="0.5"
          >
            <q-item dense clickable v-ripple to="/relatorios">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-chart-line" />
              </q-item-section>

              <q-item-section>Relatório consolidado</q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStore } from "src/stores/usuarioLogado";
import { ref } from "vue";

const leftDrawerOpen = ref(false);
const store = useStore();
const { nome, email } = storeToRefs(store);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
.q-item {
  /* margin: 0.2rem; */
}
</style>
