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

    api.patch(`v1/restrito/inventario/usuario/qtdecoleta/${id}`).then((res) => {
      resumo.value = res.data;
      console.log(res.data);
      temDados.value = !!resumo.value;
    });
  } else return;
});
</script>

<template>
  <div v-if="temDados">
    <div v-for="item in resumo" :key="item.usuario">
      {{ item.coleta }}
      <h5>Usuário: {{ item.usuario || "Sem nome" }}</h5>
      <div>
        <p class="q-mb-sm" v-for="coletado in item.coleta" :key="coletado.data">
          {{ coletado.data }} - {{ coletado.qtde }}
        </p>
        <q-table
          :title="item.usuario || 'Sem nome'"
          :data="item.coleta"
          :columns="[
            {
              name: 'data',
              align: 'left',
              label: 'Data',
              field: 'data',
            },
            { name: 'qtde', align: 'left', label: 'Quantidade', field: 'qtde' },
          ]"
          row-key="name"
        />
      </div>
      <q-separator spaced />
    </div>
  </div>
  <div v-if="!temDados">
    <p>Nada a exibir.</p>
  </div>
</template>
