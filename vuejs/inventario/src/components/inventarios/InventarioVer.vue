<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";

import { useInventariosStore } from "stores/inventarios";

const inventariosStore = useInventariosStore();
const { buscarInventario } = useInventariosStore();
const { inventario } = storeToRefs(inventariosStore);

const tabSelecionada = ref("itens_coletados");
const idInventario = ref(0);
const _route = useRoute();

const nomeInventario = ref("");

onMounted(async () => {
  if ("idInventario" in _route.params) {
    idInventario.value = +_route.params.idInventario;

    await buscarInventario(idInventario.value);
    nomeInventario.value = inventario.value.nome;
  }
});
</script>

<template>
  <div class="menu-inventario">
    <p class="text-h4 text-center q-mt-md">{{ nomeInventario }}</p>
    <q-tabs
      v-model="tabSelecionada"
      dense
      class="bg-red text-white shadow-none"
    >
      <q-btn-dropdown
        v-if="
          !!inventario && inventario.situacaoInventario.nome !== 'Preparando'
        "
        auto-close
        stretch
        flat
        label="Resumo"
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
        v-if="
          !!inventario && inventario.situacaoInventario.nome !== 'Preparando'
        "
        auto-close
        stretch
        flat
        label="Relatórios"
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
          <q-item
            clickable
            :to="{
              name: 'relatorioBase',
              query: { relatorio: 'repetidos' },
            }"
            exact
          >
            <q-item-section>Coletas repetidas</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-tabs>
    <div class="q-px-none">
      <router-view v-slot="{ Component, route }">
        <transition name="fade">
          <div :key="route.path" class="router-view-inventario">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
.q-btn:before {
  border-radius: 0;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
