<script setup>
import { storeToRefs } from "pinia";
import { useRelatoriosStore } from "src/stores/relatorios";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";

const colunasItens = [
  {
    name: "patrimonio",
    align: "left",
    label: "PATRIMÔNIO",
    field: "patrimonio",
    sortable: true,
  },
  {
    name: "descricao",
    align: "left",
    label: "DESCRIÇÃO",
    field: "descricao",
    sortable: true,
  },
];
const route = useRoute();
const relatoriosStore = useRelatoriosStore();
const { relatorio, carregando, erro } = storeToRefs(relatoriosStore);

onMounted(async () => {
  const idInventario = route.params["idInventario"];
  await relatoriosStore.bensNaoEncontrados(idInventario);
  console.dir(relatorio.value.length);
});
</script>

<template>
  <template>
    <p>Carregando: {{ carregando }}</p>
    <q-card square>
      <q-card-section v-if="carregando">
        Lorem ipsum dolor sit amet
      </q-card-section>
      <q-card-section v-if="!carregando">
        <q-table
          flat
          :loading="carregando"
          title="Bens sem patrimônio"
          :rows="relatorio || []"
          :columns="colunasItens"
          row-key="id"
          separator="cell"
          :wrap-cells="true"
          class="my-sticky-header-table"
          :selected-rows-label="registroPortugues"
          :pagination="paginacaoOpcoes"
          :bordered="false"
          loading-label="Carregando"
          no-data-label="Não foram encontrados dados."
          rows-per-page-label="Registros por página:"
        >
          <!-- <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width></q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                @click="props.expand = !props.expand"
              >
                {{ diminuiTexto(col.value) }}
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  {{ props.row.descricao }}
                </div>
              </q-td>
            </q-tr>
          </template> -->
        </q-table>
      </q-card-section>
    </q-card>
  </template>
</template>
