<template>
  <div class="q-pa-md">
    <h3>Estatísticas</h3>
    <!-- <h4>{{ resumo.inventario.nome }} - {{ resumo.qtde }}</h4> -->
    <div v-for="item in resumo.setores" :key="item.setor.id">
      <h5>Setor: {{ item.setor.nome }} - {{ item.qtde }}</h5>
      <div>
        <p v-for="dep in item.dependencias" :key="dep.nomeDependencia">
          {{ dep.nomeDependencia }} - {{ dep.qtde }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const resumo = ref([]);

onMounted(() => {
  if ("idInventario" in route.params) {
    // modo de edição ou visualização
    const id = +route.params.idInventario;

    api.get(`v1/restrito/item/qtde/${id}`).then((res) => {
      resumo.value = res.data;
    });
  } else {
    return;
  }
});
</script>
