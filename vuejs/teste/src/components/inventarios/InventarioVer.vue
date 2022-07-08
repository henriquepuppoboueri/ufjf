<template>
  <p class="text-h4 text-center q-mt-md">
    {{ "Inventário 001".toUpperCase() }}
  </p>
  <q-tabs v-model="tabSelecionada" dense class="bg-red text-white shadow-none">
    <q-btn-dropdown auto-close stretch flat label="Items originais e coletados">
      <q-list>
        <q-item clickable @click="tabSelecionada = 'items_originais'">
          <q-item-section>Items originais</q-item-section>
        </q-item>

        <q-item clickable @click="tabSelecionada = 'items_coletados'">
          <q-item-section>Items coletados</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-tab name="unid_depend" label="Unidades e dependências" />
  </q-tabs>
  <q-card square v-if="false === 'items_coletados'">
    <q-card-section class="q-px-none">
      <q-table
        flat
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        :bordered="false"
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
                color="red"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="column">
                <q-toggle :model-value="true" label="Pode editar" />
                <q-toggle :model-value="false" label="Pode cadastrar items" />
                <q-toggle :model-value="true" label="Pode editar" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions>
      <q-btn flat dense label="Enviar" type="submit" color="primary" />
      <q-btn
        label="Limpar"
        type="reset"
        color="primary"
        flat
        dense
        class="q-ml-sm"
      />
    </q-card-actions>
  </q-card>
  <q-card square v-if="tabSelecionada === 'unid_depend'">
    <q-card-section class="q-px-none">
      <q-table
        flat
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        :bordered="false"
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
                color="red"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="column">
                <q-toggle :model-value="true" label="Pode editar" />
                <q-toggle :model-value="false" label="Pode cadastrar items" />
                <q-toggle :model-value="true" label="Pode editar" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions>
      <q-btn flat dense label="Enviar" type="submit" color="primary" />
      <q-btn
        label="Limpar"
        type="reset"
        color="primary"
        flat
        dense
        class="q-ml-sm"
      />
    </q-card-actions>
  </q-card>
  <items-coletados></items-coletados>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { date, Notify } from "quasar";
import { API_URL } from "../../helper/constants.js";
import ItemsColetados from "../inventarios/items/ItemsColetados.vue";

// const isSemConexao = ref(false);
const tabSelecionada = ref("");
const id = ref(0);
const modoEdicao = ref(false);
const route = useRoute();
const router = useRouter();
const mostrarTblPermissoes = ref(false);
const dataCriacao = ref("30/06/2022");
const selected = reactive([]);
const inventarioDescricao = ref("");
const statusAtual = ref("");

// const columns = ref([
//   {
//     name: "name",
//     required: true,
//     label: "Dessert (100g serving)",
//     align: "left",
//     field: "name",
//     sortable: true,
//   },
//   {
//     name: "calories",
//     align: "center",
//     label: "Calories",
//     field: "calories",
//     sortable: true,
//   },
//   { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
//   { name: "carbs", label: "Carbs (g)", field: "carbs" },
//   { name: "protein", label: "Protein (g)", field: "protein" },
//   { name: "sodium", label: "Sodium (mg)", field: "sodium" },
//   {
//     name: "calcium",
//     label: "Calcium (%)",
//     field: "calcium",
//     sortable: true,
//     sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
//   },
//   {
//     name: "iron",
//     label: "Iron (%)",
//     field: "iron",
//     sortable: true,
//     sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
//   },
// ]);
const data = ref([
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: "0%",
    iron: "0%",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%",
  },
]);

const nomeInventario = ref("");
const usuarios = ref([]);
const colunas = ref([
  {
    name: "usuario",
    required: true,
    label: "Usuário",
    align: "left",
    // field: (row) => row.name,
    field: "usuario",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "siape",
    align: "left",
    label: "SIAPE",
    field: "siape",
    sortable: true,
  },
  {
    name: "email",
    align: "left",
    label: "E-mail",
    field: "email",
    sortable: true,
  },
]);

watch(tabSelecionada, (nv, ov) => {
  if (nv === "unid_depend") {
    console.log("Unidades");
  }
});

onMounted(() => {
  if ("id" in route.params) {
    // modo de edição
    modoEdicao.value = true;
    id.value = +route.params.id;

    axios.get(`${API_URL}v1/restrito/inventario/${id.value}`).then((res) => {
      const inventario = res.data;
      nomeInventario.value = inventario.nome;
      // statusAtual.value = inventario.situacaoInventario;
      // inventarioDescricao.value = inventario.descricao;
    });
  } else {
    return;
  }
});

function onSubmit() {
  const inventario = {
    id: id.value,
    nome: nomeInventario.value,
    situacaoInventario: statusAtual.value,
    descricao: inventarioDescricao.value,
  };
  if (modoEdicao.value) {
    axios
      .put(`${API_URL}v1/restrito/inventario/${id.value}`, inventario)
      .then((_) => {
        Notify.create({ color: "green", message: "Inventário atualizado!" });
        setTimeout(() => {
          router.push("/inventario/lista");
        }, 3000);
      })
      .catch((err) => {
        Notify.create({ color: "red", message: `Erro: ${err}` });
      });
  } else {
    axios
      .post(`${API_URL}v1/restrito/inventario}`, inventario)
      .then((_) => {
        Notify.create({ color: "green", message: "Inventário cadastrado!" });
        setTimeout(() => {
          router.push("/inventario/lista");
        }, 3000);
      })
      .catch((err) => {
        Notify.create({ color: "red", message: `Erro: ${err}` });
      });
  }
}
</script>
