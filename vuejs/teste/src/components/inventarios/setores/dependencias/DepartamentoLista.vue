<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";

import { API_URL } from "src/helper/constants";

const mostrarDialog = ref(false);
const name = ref("");
const setores = ref([]);
const keySelecionada = ref(null);
const unidadeSelecionada = ref(null);
const props = defineProps({ idInventario: Number });

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
          isSetor: true,
          key: `UNI:_${setor.id}`,
          icon: "fa-solid fa-building",
        };
        if (novoSetor.hasOwnProperty("dependencias")) {
          novoSetor.dependencias = novoSetor.dependencias.map((dependencia) => {
            return {
              ...dependencia,
              isSetor: false,
              key: `DEP:_${dependencia.id}`,
            };
          });
        }
        console.log(novoSetor);
        return novoSetor;
      });
    });
});

watch(keySelecionada, (novoValor, antigoValor) => {
  if (novoValor !== null) {
    const [isSetor, id] = novoValor.split(":_");

    if (isSetor === "UNI") {
      const index = setores.value.findIndex((setor) => setor.id === +id);
      unidadeSelecionada.value = setores.value[index].nome;
    } else if (isSetor === "DEP") {
      return;
    }
  }
});
</script>

<template>
  <q-dialog v-model="mostrarDialog">
    <q-card>
      <q-card-section>
        <q-select
          outlined
          v-model="unidadeSelecionada"
          :options="setores"
          :option-value="(setor) => setor.nome"
          :option-label="(setor) => setor.nome"
          label="Outlined"
        />
        <q-input outlined v-model="unidadeSelecionada" label="Nome" />
      </q-card-section>
      <q-card-actions class="flex-center">
        <q-btn v-if="keySelecionada" size="sm" color="green" label="Salvar" />
        <q-btn v-if="keySelecionada" size="sm" color="red" label="Cancelar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="q-pa-md q-gutter-sm">
    <div>
      <div class="q-gutter-sm">
        <q-btn
          size="sm"
          flat
          color="primary"
          label="Selecione para opções"
          @click="mostrarDialog = true"
        />
        <q-btn v-if="!keySelecionada" size="sm" color="green" label="Novo" />
        <q-btn v-if="keySelecionada" size="sm" color="blue" label="Editar" />
        <q-btn v-if="keySelecionada" size="sm" color="red" label="Excluir" />
      </div>
    </div>
    <q-tree
      :nodes="setores"
      default-expand-all
      v-model:selected="keySelecionada"
      selected-color="primary"
      node-key="key"
      label-key="nome"
      children-key="dependencias"
      no-results-label="Nenhum dado a exibir!"
    />
  </div>
</template>
