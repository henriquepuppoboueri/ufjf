<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);
const colunas = [
  {
    name: "setor",
    align: "left",
    label: "Setor",
    field: "nomeDependencia",
    sortable: true,
  },
  {
    name: "importados",
    align: "right",
    label: "Itens importados",
    field: "qtde",
    sortable: true,
  },
  {
    name: "importados",
    align: "right",
    label: "Itens coletados",
    field: "qtdeColetada",
    sortable: true,
  },
  {
    name: "percConcluido",
    align: "right",
    label: "(%) concluído",
    field: "percentualConcluido",
    sortable: true,
  },
];

onMounted(() => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;

    api.get(`v1/restrito/item/qtde/${id}`).then((res) => {
      resumo.value = res.data;
      console.log(res.data);
      temDados.value = !!resumo.value.qtde;
    });
  } else {
    return;
  }
});
</script>

<template>
  <div v-if="temDados">
    <div v-for="item in resumo.setores" :key="item.setor.id">
      <q-table
        flat
        hide-pagination
        square
        :bordered="false"
        :title="item.setor.nome"
        :rows="item.dependencias"
        :columns="colunas"
        row-key="data"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{
                col.name === "percConcluido"
                  ? parseFloat(col.value).toFixed(2)
                  : col.value
              }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom-row>
          <q-tr>
            <q-td class="text-uppercase text-bold text-left">total</q-td>
            <q-td class="text-bold text-right">{{ item.qtde }}</q-td>
            <q-td class="text-bold text-right">{{ item.qtdeColetada }}</q-td>
            <q-td class="text-bold text-right">{{
              parseFloat(item.percentualConcluido).toFixed(2)
            }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator spaced />
    </div>
  </div>
  <div v-if="!temDados">
    <p>Nada a exibir.</p>
  </div>
</template>
