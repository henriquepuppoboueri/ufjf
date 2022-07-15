<template>
  <q-table
    title="Inventários"
    :loading="loadingInventarios"
    :rows="inventarios"
    :columns="colunasInventarios"
    row-key="id"
    separator="cell"
    :wrap-cells="true"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" style="'backgroundcolor: lightGrey'">
        <q-td auto-width>
          <q-btn
            size="sm"
            :color="props.row.id === idInventarioSelecionado ? 'red' : 'green'"
            round
            dense
            @click="selecionaInventario(props.row.id)"
            :icon="props.row.id === idInventarioSelecionado ? 'remove' : 'add'"
          />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">
            This is expand slot for row above: {{ props.row.name }}.
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <q-table
    v-if="idInventarioSelecionado !== 0"
    :loading="loadingSetores"
    class="q-mt-lg"
    title="Setores do inventário"
    :rows="setoresInventario"
    :columns="colunasSetores"
    row-key="id"
    separator="cell"
    :wrap-cells="true"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            :color="props.row.id === idSetorSelecionado ? 'red' : 'green'"
            round
            dense
            @click="selecionaSetor(props.row.id)"
            :icon="props.row.id === idSetorSelecionado ? 'remove' : 'add'"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          @click="props.expand = !props.expand"
        >
          {{ col.value }}
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">{{ props.row.descricao }}.</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <q-table
    v-if="idSetorSelecionado !== 0"
    :loading="loadingDependencias"
    class="q-mt-lg"
    title="Dependências do setor"
    :rows="dependenciasSetor"
    :columns="colunasSetores"
    row-key="id"
    separator="cell"
    :wrap-cells="true"
    no-data-label="Não foram encontrados dados."
    rows-per-page-label="Registros por página:"
    :selected-rows-label="registroPortugues"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            :color="props.row.id === idDependenciaSelecionada ? 'red' : 'green'"
            round
            dense
            @click="selecionaDependencia(props.row.id)"
            :icon="props.row.id === idDependenciaSelecionada ? 'remove' : 'add'"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          @click="props.expand = !props.expand"
        >
          {{ col.value }}
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">{{ "Nada a exibir" }}</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <q-btn
    v-if="habilitaBtnSalvar"
    class="q-mt-md q-ml-md"
    :disabled="!habilitaBtnSalvar"
    color="primary"
    icon="check"
    label="Salvar"
  />
  <ItemCad v-if="idDependenciaSelecionada !== 0" :id="idDependenciaSelecionada">
  </ItemCad>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import { api } from "boot/axios";
import { API_URL } from "src/helper/constants.js";
import ItemCad from "../inventarios/items/item/ItemCad.vue";

function selecionaInventario(idInventario) {
  idSetorSelecionado.value = 0;
  if (idInventarioSelecionado.value === idInventario) {
    idInventarioSelecionado.value = 0;
    return;
  }
  idInventarioSelecionado.value = idInventario;
  loadingSetores.value = true;
  api
    .get(`v1/restrito/setor/inventario/${idInventarioSelecionado.value}`)
    .then((res) => {
      setoresInventario.value = res.data;
    });
  loadingSetores.value = false;
}

function selecionaSetor(idSetor) {
  if (idSetorSelecionado.value === idSetor) {
    idSetorSelecionado.value = 0;
    return;
  }
  idSetorSelecionado.value = idSetor;
  loadingDependencias.value = true;
  api.get(`v1/restrito/dependencia/setor/${idSetor}`).then((res) => {
    dependenciasSetor.value = res.data;
  });
  loadingDependencias.value = false;
}

function selecionaDependencia(idDependencia) {
  if (idDependenciaSelecionada.value === idDependencia) {
    idDependenciaSelecionada.value = 0;
    return;
  }
  idDependenciaSelecionada.value = idDependencia;
}

function expandirLinha(id) {
  console.log(id);
}

const habilitaBtnSalvar = computed(() => {
  return idSetorSelecionado.value !== 0 && idInventarioSelecionado.value !== 0;
});

function registroPortugues(reg) {
  const nrRegistros =
    reg > 1 ? `registro(s) selecionados.` : `registro selecionado.`;
  return `${reg} ${nrRegistros}`;
}

const inventarios = reactive([]);
const idInventarioSelecionado = ref(0);
const loadingInventarios = ref(false);

const setoresInventario = ref([]);
const idSetorSelecionado = ref(0);
const loadingSetores = ref(false);

const dependenciasSetor = ref([]);
const idDependenciaSelecionada = ref(0);
const loadingDependencias = ref(false);

const colunasInventarios = reactive([
  {
    name: "nome",
    align: "left",
    label: "Nome",
    field: "nome",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "situacaoInventario",
    sortable: true,
  },
]);

const colunasSetores = reactive([
  {
    name: "nome",
    align: "center",
    label: "Nome",
    field: "nome",
    sortable: true,
  },
]);

const colunasDependencias = reactive([
  {
    name: "nome",
    align: "center",
    label: "Nome",
    field: "nome",
    sortable: true,
  },
]);

onMounted(() => {
  loadingInventarios.value = true;
  api
    .get(`v1/restrito/inventario`)
    .then((res) => {
      Object.assign(inventarios, res.data);
    })
    .catch(console.log);
  loadingInventarios.value = false;
});
</script>
