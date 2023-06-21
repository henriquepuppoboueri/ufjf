<script setup>
import { ref, computed } from "vue";

import lodash from "lodash";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

import { useInventariosStore } from "stores/inventarios";
import { useUsuariosStore } from "stores/usuarios";
import { useRoute } from "vue-router";

const inventariosStore = useInventariosStore();
const { usuariosInventario, presidentes } = storeToRefs(inventariosStore);
const novoUsuario = ref(null);
const usuariosListaFiltro = ref([]);
const usuariosStore = useUsuariosStore();
const { usuarios } = storeToRefs(usuariosStore);
const route = useRoute();

const usuariosSemVinculo = computed(() => {
  return lodash.differenceBy(usuarios.value, usuariosInventario.value, "id");
});

function filterFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  update(() => {
    if (val === "") {
      novoUsuario.value = null;
      usuariosListaFiltro.value = usuariosSemVinculo.value;
    } else {
      const needle = val.toLowerCase();
      usuariosListaFiltro.value = usuariosSemVinculo.value.filter(
        (v) => v.nome.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

async function addUsuarioInventario() {
  const { idInventario } = route.params;
  const usuInventario = { idInventario, idUsuario: novoUsuario.value.id };

  try {
    await inventariosStore.addUsuarioInventario(idInventario, usuInventario);
    Notify.create({
      color: "green",
      message: `Usuário ${novoUsuario.value.nome} vinculado!`,
    });
  } catch (err) {
    let errMsg = err;
    if (err.response && err.response.data) errMsg = err.response.data;
    Notify.create({
      color: "red",
      // message: errorMsg,
      message: `Erro ao vincular usuário: ${errMsg}`,
    });
  } finally {
    novoUsuario.value = null;
  }
}
</script>

<template>
  <div></div>
  <q-input
    outlined
    type="text"
    label="Presidente"
    :model-value="presidentes"
    disable
    :bg-color="presidentes ? 'green-2' : 'red-2'"
  />
  <q-separator spaced />
  <div class="row q-gutter-x-sm justify-between no-wrap">
    <q-select
      v-model="novoUsuario"
      class="fit"
      outlined
      use-input
      hide-selected
      fill-input
      input-debounce="300"
      label="Adicionar usuário"
      :options="usuariosListaFiltro"
      :option-label="(row) => row.nome"
      @filter="filterFn"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> Sem resultado. </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-btn
      id="btnAddUsuario"
      :disable="!novoUsuario"
      outline
      icon="add"
      color="green"
      @click="addUsuarioInventario"
    />
  </div>
</template>

<style scoped lang="sass">
.q-btn:before
  border-radius: 4px
</style>
