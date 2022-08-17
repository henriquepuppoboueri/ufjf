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
          <q-item clickable :to="{ name: 'bensSemPatrimonio' }" exact>
            <q-item-section>Bem sem patrimônio</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'bensNaoColetados' }" exact>
            <q-item-section>Bens não coletados</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'plaquetasComProblemas' }" exact>
            <q-item-section>Plaquetas com problemas</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'bensOutrasUnidades' }" exact>
            <q-item-section>[Bens em outras unidades]</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'bensSemItens' }" exact>
            <q-item-section>Coletas sem itens (não-importados)</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'resumoGeral' }" exact>
            <q-item-section>[Resumo geral]</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-tabs>
    <div class="q-px-none">
      <!-- <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view> -->
      <router-view v-slot="{ Component, route }">
        <transition name="fade">
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
      <!-- <router-view></router-view> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useInventariosStore } from "stores/inventarios";
import { storeToRefs } from "pinia";
// import { useItensImportadosStore } from "src/stores/itensImportados";
// import { useItensColetadosStore } from "src/stores/itensColetados";

// const itensImportadosStore = useItensColetadosStore();
// const { itensImportados } = storeToRefs(itensImportadosStore);
// const itensColetadosStore = useItensColetadosStore();
// const { itensColetados } = storeToRefs(itensColetadosStore);
// const { buscarItensImportados } = useItensImportadosStore();
// const { buscarItensColetados } = useItensColetadosStore();
const inventariosStore = useInventariosStore();
const { buscarInventario } = useInventariosStore();
const { inventario } = storeToRefs(inventariosStore);
const tabSelecionada = ref("itens_coletados");
const id = ref(0);
const route = useRoute();

const nomeInventario = ref("");

// onBeforeRouteLeave((to, from, next) => {
//   console.log("beforeLeave");
//   console.log(to, from);
// });

onMounted(async () => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    id.value = +route.params.idInventario;

    // await buscarItensColetados(id.value);
    // await buscarItensImportados(id.value);

    await buscarInventario(id.value);
    nomeInventario.value = inventario.value.nome;
  }
});
</script>

<style>
.q-btn:before {
  border-radius: 0;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
