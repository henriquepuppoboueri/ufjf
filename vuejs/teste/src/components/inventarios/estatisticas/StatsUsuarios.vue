<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);

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
</script>

<template>
  <div v-if="temDados">
    <div v-for="item in resumo" :key="item.usuario">
      <q-table
        flat
        hide-pagination
        square
        :bordered="false"
        :title="item.usuario.nome || 'Sem nome'"
        :rows="item.coleta"
        :rows-per-page-options="[0]"
        :columns="[
          {
            name: 'data',
            align: 'left',
            label: 'Data',
            field: 'data',
            sortable: true,
          },
          {
            name: 'qtde',
            align: 'left',
            label: 'Quantidade',
            field: 'qtde',
            sortable: true,
          },
        ]"
        row-key="data"
      />
      <q-separator spaced />
    </div>
  </div>
  <div v-if="!temDados">
    <p>Nada a exibir.</p>
  </div>
</template>
