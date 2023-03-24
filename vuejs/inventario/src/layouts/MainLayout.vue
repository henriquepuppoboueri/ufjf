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
          <q-item>
            <q-item-section class="col-grow">
              <q-item-label>{{
                usuario ? usuario.nome : "Visitante"
              }}</q-item-label>
              <q-item-label caption>
                {{ usuario ? usuario.email : "" }}
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
                :to="'/logout'"
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
          <q-separator />
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
                <q-icon
                  text-color="white"
                  name="fa-solid fa-file-circle-plus"
                />
              </q-item-section>

              <q-item-section>Novo inventário</q-item-section>
            </q-item>

            <q-item dense to="/inventario" exact clickable v-ripple>
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
            <q-item dense clickable v-ripple to="/ferramentas">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-upload" />
              </q-item-section>

              <q-item-section>Importar arquivo do SIGA</q-item-section>
            </q-item>
            <q-item dense clickable v-ripple to="/etiquetas">
              <q-item-section avatar>
                <q-icon text-color="white" name="fa-solid fa-tag" />
              </q-item-section>

              <q-item-section>Imprimir etiquetas</q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- <q-expansion-item
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
          </q-expansion-item> -->
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const { carregando, erro } = storeToRefs(authStore);
const usuario = authStore.usuario;
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {});
</script>
