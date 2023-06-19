<script setup>
import { diminuiTexto, registroPortugues } from '/helper/functions';
import { paginacaoOpcoes } from '/helper/qtableOpcoes';
import { exportTable } from '/helper/functions';

const setoresStore = useSetoresStore();
const {
  setoresDependencias,
  setor,
  dependencia,
  erro,
  carregando: carregandoSetores,
} = storeToRefs(setoresStore);
const { buscarSetoresDependencias } = setoresStore;

const itensImportadosStore = useItensImportadosStore();
const {
  itensImportados,
  carregando: carregandoItens,
  itensNominais,
} = storeToRefs(itensImportadosStore);
const { buscarItensImportados } = itensImportadosStore;

const itensSelecionados = ref([]);
const filtro = ref('');
const router = useRouter();
const route = useRoute();
const colunasItens = reactive([
  {
    name: 'patrimonio',
    align: 'left',
    label: 'PATRIMÔNIO',
    field: 'patrimonio',
    sortable: true,
  },
  {
    name: 'descricao',
    align: 'left',
    label: 'DESCRIÇÃO',
    field: 'descricao',
    sortable: true,
  },
  {
    name: 'setor',
    align: 'left',
    label: 'SETOR',
    field: 'setor',
    sortable: true,
  },
  {
    name: 'dependencia',
    align: 'left',
    label: 'DEPENDÊNCIA',
    field: 'dependencia',
    sortable: true,
  },
]);
const colunasFiltro = ref([]);

function filtroAvancado(row, terms, cols, getCellValue) {
  if (!terms) return row;

  if (colunasFiltro.value.hasOwnProperty('field')) {
    return row.filter((item) =>
      item[colunasFiltro.value.field]
        .toLowerCase()
        .includes(terms.toLowerCase())
    );
  }

  // return row;
  const data = row.filter((item) => {
    return Object.values(item)
      .toString()
      .toLowerCase()
      .includes(terms.toLowerCase());
  });

  return data;
}

const qtItensSelec = computed(() => {
  return itensSelecionados.value.length;
});

onBeforeMount(() => {
  renderPage();
});

// watch(
//   () => route.path,
//   (to, from) => {
//     renderPage();
//   }
// );

function limparFiltro() {
  setor.value = null;
  dependencia.value = null;
}

watch(itensSelecionados, (nv, ov) => {
  if (nv.length > 1) {
    itensSelecionados.value.shift();
  }
});

function verItem() {
  if (itensSelecionados.value.length === 1) {
    router.push({
      name: 'itemImportado',
      params: { idItem: itensSelecionados.value[0] },
    });
  }
}

async function renderPage() {
  const { idInventario } = route.params;

  if (!idInventario) return;

  try {
    await buscarSetoresDependencias(idInventario);
    await buscarItensImportados(idInventario);
  } catch (error) {
    // todo
  } finally {
    // todo
  }
}
</script>

<template>
  <q-card square>
    <q-card-section>
      <q-table
        flat
        :loading="carregandoItens"
        title="Itens importados"
        :rows="itensNominais"
        :columns="colunasItens"
        row-key="id"
        separator="cell"
        selection="multiple"
        :wrap-cells="true"
        :filter="filtro"
        :filter-method="filtroAvancado"
        :selected-rows-label="registroPortugues"
        :pagination="paginacaoOpcoes"
        :bordered="false"
        loading-label="Carregando"
        no-data-label="Não foram encontrados dados."
        rows-per-page-label="Registros por página:"
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #top-right>
          <div class="row q-gutter-sm">
            <q-select
              v-model="colunasFiltro"
              dense
              filled
              :options="colunasItens"
              stack-label
              label="Filtrar por coluna"
              single
              clearable
              @clear="() => (colunasFiltro = [])"
            >
              <template #option="{ itemProps, opt, selected, toggleOption }">
                <q-item v-bind="itemProps">
                  <q-item-section>
                    <q-item-label> {{ opt.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              v-model="filtro"
              borderless
              dense
              filled
              debounce="300"
              placeholder="Filtrar"
              clearable
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template #loading>
          <q-inner-loading :showing="carregandoItens">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox
                v-model="itensSelecionados"
                left-label
                :val="props.row.id"
              />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="props.expand = !props.expand"
            >
              <span>{{ diminuiTexto(col.value) }}</span>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <span>{{ props.row.descricao }}</span>
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
        icon="download"
        dense
        color="green"
        label="Exportar"
        @click="exportTable(colunasItens, itensNominais, 'itens-importados')"
      />
    </q-card-actions>
  </q-card>
</template>

<style lang="sass">
.my-sticky-header-table

.q-card__section--vert
  padding: 0

.q-btn
  min-width: 5rem
</style>
