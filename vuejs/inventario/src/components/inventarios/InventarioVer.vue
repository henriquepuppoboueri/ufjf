<template>
  <div>
    <p class="text-h4 text-center q-mt-md">{{ nomeInventario }}</p>
    <q-tabs
      v-model="tabSelecionada"
      dense
      class="bg-red text-white shadow-none"
    >
      <q-btn-dropdown
        auto-close
        stretch
        flat
        label="Resumo"
        v-if="
          !!inventario && inventario.situacaoInventario.nome !== 'Preparando'
        "
      >
        <q-list>
          <q-item clickable :to="{ name: 'resumoSetores' }" exact>
            <q-item-section>Por setor</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'resumoUsuarios' }" exact>
            <q-item-section>Por usuário</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'resumoSemana' }" exact>
            <q-item-section>Por semana</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'resumoDia' }" exact>
            <q-item-section>Por dia</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!-- <q-btn class="btn-nav" :to="{ name: 'resumo' }">RESUMO</q-btn> -->
      <q-btn-dropdown auto-close stretch flat label="Itens">
        <q-list>
          <q-item clickable :to="{ name: 'itensColetados' }" exact>
            <q-item-section>Itens coletados (lançados)</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'itensImportados' }" exact>
            <q-item-section>Itens originais (importados)</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn class="btn-nav" :to="{ name: 'Unidades' }">DEPENDÊNCIAS</q-btn>
      <q-btn class="btn-nav" :to="{ name: 'Permissoes' }">PERMISSÕES</q-btn>
      <q-btn-dropdown
        auto-close
        stretch
        flat
        label="Relatórios"
        v-if="
          !!inventario && inventario.situacaoInventario.nome !== 'Preparando'
        "
      >
        <q-list>
          <q-item
            clickable
            :to="{
              name: 'relatorioBase',
              query: { relatorio: 'sem-patrimonio' },
            }"
            exact
          >
            <q-item-section>Bem sem patrimônio</q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{
              name: 'relatorioBase',
              query: { relatorio: 'nao-coletados' },
            }"
            exact
          >
            <q-item-section>Bens não coletados</q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{
              name: 'relatorioBase',
              query: { relatorio: 'plaquetas-problemas' },
            }"
            exact
          >
            <q-item-section>Plaquetas com problemas</q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{
              name: 'relatorioBase',
              query: { relatorio: 'local-diferente' },
            }"
            exact
          >
            <q-item-section>Bens em outras unidades</q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{
              name: 'relatorioBase',
              query: { relatorio: 'sem-itens' },
            }"
            exact
          >
            <q-item-section>Coletas sem itens</q-item-section>
          </q-item>
          <!-- <q-item clickable :to="{ name: 'bensSemItens' }" exact>
            <q-item-section>Coletas sem itens (não-importados)</q-item-section>
          </q-item> -->
          <!-- <q-item clickable :to="{ name: 'etiqueta' }" exact>
            <q-item-section>Imprimir etiquetas</q-item-section>
          </q-item> -->
          <!-- <q-item clickable :to="{ name: 'resumoGeral' }" exact>
            <q-item-section>[Resumo geral]</q-item-section>
          </q-item> -->
        </q-list>
      </q-btn-dropdown>
    </q-tabs>
    <div class="q-px-none">
      <router-view v-slot="{ Component, route }">
        <transition name="fade">
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Notify } from "quasar";
import { storeToRefs } from "pinia";

import { useInventariosStore } from "stores/inventarios";
import { useUsuariosStore } from "src/stores/usuarios";

const inventariosStore = useInventariosStore();
const { buscarInventario, buscarUsuariosInventario } = useInventariosStore();
const { inventario, usuariosInventario } = storeToRefs(inventariosStore);

const usuariosStore = useUsuariosStore();
const { usuarioInventarios } = storeToRefs(usuariosStore);

const tabSelecionada = ref("itens_coletados");
const idInventario = ref(0);
const route = useRoute();
const router = useRouter();

const nomeInventario = ref("");
const usuInventarios = ref([]);

onMounted(async () => {
  if ("idInventario" in route.params) {
    await usuarioPodeVerInventario();

    await buscarInventario(idInventario.value);
    nomeInventario.value = inventario.value.nome;
  }
});

const usuarioPodeVerInventario = async () => {
  idInventario.value = +route.params.idInventario;
  usuInventarios.value = await usuarioInventarios.value;

  if (
    !usuInventarios.value
      .map((inventario) => inventario.idInventario)
      .includes(idInventario.value)
  ) {
    Notify.create({
      color: "red",
      message: `Usuário não tem permissão ao inventário.`,
    });
    router.replace({
      path: `/inventario`,
    });
  }
};

watch(
  () => route.path,
  (to, from) => {
    if (to !== "/inventario") {
      usuarioPodeVerInventario();
    }
  }
);
</script>

<style>
.q-btn:before {
  border-radius: 0;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
