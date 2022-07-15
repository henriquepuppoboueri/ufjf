<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

import { API_URL } from "src/helper/constants";
import { Notify } from "quasar";

const route = useRoute();
const idInventario = ref(null);
const mostrarDialogAdicao = ref(false);
const mostrarDialogEdicao = ref(false);
const name = ref("");
const setores = ref([]);
const keySelecionada = ref(null);
const unidadeSelecionada = ref({
  id: 0,
  nome: "",
  dependencias: [],
  isSetor: true,
});
const novaUnidade = ref({
  id: 0,
  nome: "",
  dependencias: [],
  isSetor: true,
});

function addUnidade() {
  let url = "";
  if (unidadeSelecionada.value.id === 0) {
    unidadeSelecionada.value = {
      id: 0,
      nome: "",
      dependencias: [],
      isSetor: true,
    };
  } else {
    // const unidadeTemp = { ...unidadeSelecionada.value };
    // unidadeSelecionada.value = { id: 0, nome: "" };
  }
  mostrarDialogAdicao.value = true;
}

function editarUnidade() {
  mostrarDialogEdicao.value = true;
  // const unidade = {
  //   idInventario: props.idInventario,
  //   nome: unidadeSelecionada.value.nome,
  //   id: unidadeSelecionada.value.id,
  // };
  // api
  //   .put(`v1/restrito/setor/${unidadeSelecionada.value.id}`, unidade)
  //   .then((res) => {
  //     Notify.create({
  //       color: "green",
  //       message: `Unidade atualizada. \nAtualize a página!`,
  //     });
  //   })
  //   .catch((err) => {
  //     Notify.create({ color: "red", message: `Erro: ${err}` });
  //   });
}

function deletarUnidade() {
  api
    .delete(`v1/restrito/setor/${unidadeSelecionada.value.id}`)
    .then((res) => {
      Notify.create({
        color: "green",
        message: `Unidade excluída. \nAtualize a página!`,
      });
    })
    .catch((err) => {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    });
}

function salvarAddUnidade(isEditando) {
  const unidade = {
    idInventario: props.idInventario,
    nome: unidadeSelecionada.value.nome,
  };

  const isUnidade = unidadeSelecionada.value.isSetor;

  let promise = null;
  if (isUnidade) {
    console.log("É unidade!");
    if (isEditando) {
      console.log("Editando unidade");
    } else {
      console.log("Cadastrando unidade");
      promise = api.post(`v1/restrito/setor`, unidade);
    }
  } else {
    if (isEditando) {
      console.log("Editando dependência");
    } else {
      console.log("Cadastrando dependência");
    }
  }

  return;

  api
    .post(`v1/restrito/setor`, unidade)
    .then((res) => {
      Notify.create({
        color: "green",
        message: `Unidade criada! Atualize a página.`,
      });
      mostrarDialog.value = false;
    })
    .catch((err) => {
      Notify.create({ color: "red", message: `Erro: ${err}` });
    });
}
onMounted(() => {
  idInventario.value = +route.params.idInventario || false;

  if (!idInventario.value) return;

  api
    .get(`v1/restrito/inventario/setor/dependencia/${idInventario.value}`)
    .then((res) => {
      setores.value = res.data.map((setor) => {
        const novoSetor = {
          ...setor,
          key: JSON.stringify({ idSetor: setor.id, idDep: 0 }),
          icon: "fa-solid fa-building",
          isSetor: true,
        };
        if (novoSetor.hasOwnProperty("dependencias")) {
          novoSetor.dependencias = novoSetor.dependencias.map((dependencia) => {
            return {
              ...dependencia,
              key: JSON.stringify({ idSetor: setor.id, idDep: dependencia.id }),
              idSetor: setor.id,
              isSetor: false,
            };
          });
        }
        return novoSetor;
      });
    });
});

const dialogLbl = computed(() => {
  if (unidadeSelecionada.value.id === 0) {
    return "Nova unidade";
  }
  return "Nova dependência";
});

const isUnidade = computed(() => {
  return unidadeSelecionada.value.isSetor;
});

function onSelecionaUnidade(selected) {
  if (selected !== null) {
    const unidadeConvertida = JSON.parse(selected);
    const setorEncontrado = setores.value.filter(
      (unid) => unid.id === unidadeConvertida.idSetor
    )[0];

    if (!unidadeConvertida.idDep) {
      unidadeSelecionada.value = setorEncontrado;
    } else {
      const depEncontrado = setorEncontrado.dependencias.filter(
        (dep) => dep.id === unidadeConvertida.idDep
      )[0];
      unidadeSelecionada.value = depEncontrado;
    }
  } else {
    unidadeSelecionada.value = {
      id: 0,
      nome: "",
      dependencias: [],
      isSetor: true,
    };
  }
}
</script>

<template>
  <!-- Dialog Edição -->
  <q-dialog v-model="mostrarDialogEdicao">
    <q-card>
      <q-card-section>
        <p class="text-center text-h6">{{ dialogLbl }}</p>
        <q-input
          id="inputUnidade"
          outlined
          v-model="unidadeSelecionada.nome"
          label="Unidade/dependência"
        />
      </q-card-section>
      <q-card-actions class="flex-center q-gutter-md">
        <q-btn
          v-if="!!unidadeSelecionada.nome"
          size="sm"
          color="green"
          label="Salvar"
          @click="salvarEditarUnidade"
        />
        <q-btn size="sm" color="red" label="Cancelar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Dialog Adição -->
  <q-dialog v-model="mostrarDialogAdicao">
    <q-card>
      <q-card-section>
        <p class="text-center text-h6">{{ dialogLbl }}</p>
        <q-input
          id="inputUnidade"
          outlined
          v-model="novaUnidade.nome"
          label="Unidade/dependência"
        />
      </q-card-section>
      <q-card-actions class="flex-center q-gutter-md">
        <q-btn
          v-if="!!novaUnidade.nome"
          size="sm"
          color="green"
          label="Salvar"
          @click="salvarAddUnidade"
        />
        <q-btn size="sm" color="red" label="Cancelar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="q-pa-md q-gutter-sm">
    <div class="q-gutter-x-sm" v-if="isUnidade">
      <q-btn
        v-if="!keySelecionada"
        size="sm"
        color="green"
        label="+ unidade"
        @click="addUnidade"
      />
      <q-btn
        v-if="keySelecionada"
        size="sm"
        color="green"
        label="+ depend."
        @click="addUnidade"
      />
      <q-btn
        v-if="keySelecionada"
        size="sm"
        color="blue"
        label="editar"
        @click="editarUnidade"
      />
      <q-btn
        v-if="keySelecionada"
        size="sm"
        color="red"
        label="excluir"
        @click="deletarUnidade"
      />
    </div>
    <div class="q-gutter-x-sm" v-if="!isUnidade">
      <q-btn
        v-if="keySelecionada"
        size="sm"
        color="blue"
        label="Editar"
        @click="editarUnidade"
      />
      <q-btn
        v-if="keySelecionada"
        size="sm"
        color="red"
        label="Excluir"
        @click="deletarDependencia"
      />
    </div>
    <q-separator></q-separator>
    <q-tree
      :nodes="setores"
      default-expand-all
      v-model:selected="keySelecionada"
      selected-color="primary"
      node-key="key"
      label-key="nome"
      children-key="dependencias"
      no-results-label="Nenhum dado a exibir!"
      @update:selected="onSelecionaUnidade"
    >
    </q-tree>
  </div>
</template>
<!--
<style>
.inputUnidade {
  min-width: "350px";
}
</style> -->
