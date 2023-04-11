<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { paginacaoOpcoes } from "src/helper/qtableOpcoes";

const config = ref({ itensPorPagina: paginacaoOpcoes.rowsPerPage });
const router = useRouter();

const saveConfig = () => {
  localStorage.setItem("itensPorPagina", config.value.itensPorPagina);
  paginacaoOpcoes.rowsPerPage = config.value.itensPorPagina;
  router.replace({ path: "/" });
};

onMounted(() => {
  config.value.itensPorPagina = paginacaoOpcoes.rowsPerPage;
});
</script>

<template>
  <div class="q-gutter-md">
    <q-card class="my-card" flat>
      <q-card-section>
        <q-input
          type="number"
          label="Registro por pág. nas tabelas"
          v-model="config.itensPorPagina"
        />
      </q-card-section>

      <q-card-section>
        <q-btn
          color="primary"
          label="Gravar"
          @click="saveConfig"
          :disabled="!config.itensPorPagina"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="sass"></style>
