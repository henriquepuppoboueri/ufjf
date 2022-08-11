<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const resumo = ref([]);
const temDados = ref(false);
const usuariosDados = ref([]);
const colunas = [
  {
    name: "data",
    align: "left",
    label: "DATA",
    field: "data",
    sortable: true,
  },
  {
    name: "qtde",
    align: "left",
    label: "QUANTIDADE",
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
  if (item.coleta === null) return 0;
  return item.coleta
    .map((i) => {
      return i.qtde;
    })
    .reduce((pv, cv) => pv + cv);
}

function mostrarDadosUsuario(idUsuario) {
  // if (usuariosDados.includes(idUsuario)) {
  //   const index = usuariosDados.indexOf(idUsuario);
  //   usuariosDados.pop()
  // } else {
  //   usuariosDados.push(idUsuario);
  // }
  // if (idUsuario) usuariosDados.push(idUsuario);
  return usuariosDados.value.includes(idUsuario);
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
        :rows="item.coleta !== null ? item.coleta : [{ data: '-', qtde: '-' }]"
        :columns="colunas"
        :rows-per-page-options="[0]"
        row-key="data"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" v-show="mostrarDadosUsuario(item.usuario.id)">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom-row="props">
          <q-tr :props="props" @click="usuariosDados.push(item.usuario.id)">
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
