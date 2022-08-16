<script setup>
import { storeToRefs } from "pinia";
import { useRelatoriosStore } from "src/stores/relatorios";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { exportFile } from "quasar";

import { diminuiTexto, registroPortugues } from "src/helper/functions";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";

const router = useRouter();
const itensSelecionados = ref([]);
const filtro = ref("");
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

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

watch(itensSelecionados, (nv, ov) => {
  if (nv.length > 1) {
    itensSelecionados.value.shift();
  }
});

onMounted(async () => {
  const idInventario = route.params["idInventario"];
  await relatoriosStore.bensNaoEncontrados(idInventario);
});

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: "itemImportado",
      params: { idItem: itensSelecionados.value[0] },
    });
  }
}
function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

function exportTable() {
  // naive encoding to csv format
  const content = [colunasItens.map((col) => wrapCsvValue(col.label))]
    .concat(
      relatorio.value.map((row) =>
        colunasItens
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile("table-export.csv", content, "text/csv");

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}

function exportarDados() {
  const status = exportFile("bens-sem-patrimonio.csv", relatorio, {
    encoding: "windows-1252",
    mimeType: "text/csv;charset=windows-1252;",
  });

  if (status === true) {
    // browser allowed it
  } else {
    // browser denied it
    console.log("Error: " + status);
  }
}
</script>

<template>
  <q-card square>
    <q-card-section>
      <!-- <q-card-section v-if="!carregando"> -->
      <q-table
        flat
        :loading="carregando"
        title="Bens sem patrimônio"
        :rows="relatorio"
        :columns="colunasItens"
        row-key="id"
        separator="cell"
        :wrap-cells="true"
        :filter="filtro"
        :selected-rows-label="registroPortugues"
        :pagination="paginacaoOpcoes"
        :bordered="false"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:top-right>
          <q-input
            borderless
            dense
            filled
            debounce="300"
            v-model="filtro"
            placeholder="Filtrar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox
                left-label
                v-model="itensSelecionados"
                :val="props.row.id"
              />
            </q-td>
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
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions>
      <q-btn
        v-if="qtItensSelec && qtItensSelec === 1"
        dense
        color="orange"
        class="text-white"
        label="Visualizar"
        @click="verItem"
      />
      <q-btn
        v-if="!carregando"
        dense
        color="red"
        class="text-white"
        label="Exportar"
        @click="exportTable"
      />
    </q-card-actions>
  </q-card>
</template>
