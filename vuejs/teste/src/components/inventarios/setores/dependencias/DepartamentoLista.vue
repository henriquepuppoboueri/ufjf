<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";

import { API_URL } from "src/helper/constants";
import { Notify } from "quasar";

const mostrarDialog = ref(false);
const name = ref("");
const setores = ref([]);
const keySelecionada = ref(null);
const unidadeSelecionada = ref({
  id: 0,
  nome: "",
  dependencias: [],
  isSetor: true,
});
const props = defineProps({ idInventario: Number });
const isBtnEditarHabilitado = ref(false);
const isBtnExcluirHabilitado = ref(false);

function novaUnidade() {
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
  mostrarDialog.value = true;
}

function editarUnidade() {
  mostrarDialog.value = true;
  // const unidade = {
  //   idInventario: props.idInventario,
  //   nome: unidadeSelecionada.value.nome,
  //   id: unidadeSelecionada.value.id,
  // };
  // axios
  //   .put(`${API_URL}v1/restrito/setor/${unidadeSelecionada.value.id}`, unidade)
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
  axios
    .delete(`${API_URL}v1/restrito/setor/${unidadeSelecionada.value.id}`)
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

function salvarUnidade(isEditando) {
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
      promise = axios.post(`${API_URL}v1/restrito/setor`, unidade);
    }
  } else {
    if (isEditando) {
      console.log("Editando dependência");
    } else {
      console.log("Cadastrando dependência");
    }
  }

  return;

  axios
    .post(`${API_URL}v1/restrito/setor`, unidade)
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
  if (!props.idInventario || props.idInventario === 0) return;

  axios
    .get(
      `${API_URL}v1/restrito/inventario/setor/dependencia/${props.idInventario}`
    )
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
  <q-dialog v-model="mostrarDialog">
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
          @click="salvarUnidade"
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
        @click="novaUnidade"
      />
      <q-btn
        v-if="keySelecionada"
        size="sm"
        color="green"
        label="+ depend."
        @click="novaUnidade"
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
