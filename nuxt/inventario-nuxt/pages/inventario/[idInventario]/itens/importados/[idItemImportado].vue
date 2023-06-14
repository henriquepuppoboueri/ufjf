<template>
  <section>
    <q-form class="col q-ma-sm q-gutter-y-sm">
      <q-input v-model="patrimonio" outlined label="Patrimônio" dense disable />
      <q-editor
        v-model="itemDescricao"
        min-height="5rem"
        placeholder="Descrição"
        dense
        disable
      />
      <q-select
        v-model="setor"
        outlined
        :options="setoresDependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Setor"
        dense
        disable
      />
      <q-select
        v-model="dependencia"
        outlined
        :options="dependencias"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Dependência"
        dense
        disable
      />
      <q-input v-model="empenho" outlined label="Empenho" dense disable />
      <!-- <q-select
        outlined
        v-model="estadoPlaqueta"
        :options="estadosPlaquetas"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Estado da plaqueta"
        dense
      /> -->
      <q-input
        v-model="nomeFornecedor"
        outlined
        label="Fornecedor"
        dense
        disable
      />
      <!-- <q-editor
        v-model="itemLocalizacao"
        min-height="5rem"
        placeholder="Localização"
        dense
      /> -->
      <!-- <q-editor
        v-model="itemObservacao"
        min-height="5rem"
        placeholder="Observação"
        dense
      /> -->
      <!-- <q-select
        outlined
        v-model="situacao"
        :options="situacoes"
        :option-label="(item) => item.nome"
        :option-value="(item) => item.nome"
        label="Situação"
        dense
      /> -->
      <q-input
        v-model="usuario"
        outlined
        disabled
        label="Usuário"
        dense
        disable
      />
    </q-form>
  </section>
  <section class="row q-gutter-x-sm q-px-sm q-my-md">
    <q-btn dense color="primary" label="Voltar" @click="router.go(-1)" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsuariosStore } from 'src/stores/usuarios';
import { useItensImportadosStore } from 'src/stores/itensImportados';
import { useSetoresStore } from 'src/stores/setores';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDependenciasStore } from 'src/stores/dependencias';

definePageMeta({ name: 'itemImportado' });

const router = useRouter();
const dependenciasStore = useDependenciasStore();
const route = useRoute();
const setoresStore = useSetoresStore();
const itensImportadosStore = useItensImportadosStore();
const usuariosStore = useUsuariosStore();
const itemDescricao = ref('');
const dependenciaAtual = ref('');
const empenho = ref('');
const nomeFornecedor = ref('');
const patrimonio = ref([]);
const { dependencias, dependencia } = storeToRefs(dependenciasStore);
const { setoresDependencias, setor } = storeToRefs(setoresStore);
const { itemImportado } = storeToRefs(itensImportadosStore);
const { buscarItemImportado } = useItensImportadosStore();
const usuario = ref('');

onMounted(async () => {
  const idItem = +route.params.idItem;
  if (!idItem) return;

  await montaForm(idItem);
});

async function montaForm(idItem) {
  await buscarItemImportado(idItem);
  // await setoresStore.buscarSetoresDependencias(itemImportado.value.inventario)
  await setoresStore.buscarSetor(itemImportado.value.setor.id);
  await dependenciasStore.buscarDependencia(itemImportado.value.dependencia.id);
  await dependenciasStore.buscarDependencias(itemImportado.value.setor.id);

  patrimonio.value = itemImportado.value.patrimonio;
  itemDescricao.value = itemImportado.value.descricao;
  empenho.value = itemImportado.value.empenho;

  dependenciaAtual.value = itemImportado.value.dependencia;
  nomeFornecedor.value = itemImportado.value.fornecedor;
  usuario.value = itemImportado.value.usuario;
}

function extraiSituacao(idSituacao) {
  return situacoes.value.find((situ) => situ.id === idSituacao);
}
</script>
