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

    api.get(`v1/restrito/item/qtde/${id}`).then((res) => {
      resumo.value = res.data;
      temDados.value = !!resumo.value.qtde;
    });
  } else {
    return;
  }
});
</script>

<template>
  <div v-if="temDados">
    <h5>[Setor] - [nº de itens importados]</h5>
    <div v-for="item in resumo.setores" :key="item.setor.id">
      <h5>Setor: {{ item.setor.nome }} - {{ item.qtde }}</h5>
      <div>
        <p
          class="q-mb-sm"
          v-for="dep in item.dependencias"
          :key="dep.nomeDependencia"
        >
          {{ dep.nomeDependencia }} - {{ dep.qtde }}
        </p>
      </div>
    </div>
  </div>
  <div v-if="!temDados">
    <p>Nada a exibir.</p>
  </div>
</template>
