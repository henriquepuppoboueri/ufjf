<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);
const colunas = [
  {
    name: "data",
    align: "left",
    label: "Data",
    field: "data",
    sortable: true,
  },
  {
    name: "qtde",
    align: "left",
    label: "Quantidade",
    field: "qtde",
    sortable: true,
  },
];

onMounted(() => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;

    api.get(`v1/restrito/inventario/usuario/qtdecoleta/${id}`).then((res) => {
      resumo.value = res.data;
      temDados.value = !!resumo.value;
    });
  } else return;
});

function somaQtde(item) {
  return item.coleta.map((i) => i.qtde).reduce((pv, cv) => pv + cv);
}
</script>

<template>
  <div class="col q-gutter-y-md" v-if="temDados">
    <div v-for="item in resumo" :key="item.usuario">
      <q-table
        flat
        hide-pagination
        square
        :bordered="false"
        :title="item.usuario.nome"
        :rows="item.coleta"
        :columns="colunas"
        :rows-per-page-options="[0]"
        row-key="data"
      >
        <template v-slot:bottom-row>
          <q-tr>
            <q-td class="text-uppercase text-bold text-left">total</q-td>
            <q-td class="text-bold text-left">
              {{ somaQtde(item) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator class="no-margin" spaced />
    </div>
  </div>
  <div v-if="!temDados">
    <p>Nada a exibir.</p>
  </div>
</template>
