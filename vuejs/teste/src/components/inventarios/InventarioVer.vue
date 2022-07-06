<template>
  <div class="q-pa-md">
    <!-- <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md"> -->
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-input outlined v-model="nomeInventario" label="Nome do inventário" />

      <q-select
        outlined
        v-model="statusAtual"
        :options="statusOpcoes"
        label="Status do inventário"
      />
      <!-- <q-input
        readonly
        outlined
        v-model="dataCriacao"
        mask="##/##/####"
        label="Data de criação"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date readonly v-model="dataCriacao" mask="yyyy-MM-dd">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input> -->

      <q-editor
        v-model="inventarioDescricao"
        min-height="5rem"
        placeholder="Descrição"
      />

      <q-btn
        outline
        dense
        @click="mostrarTblPermissoes = !mostrarTblPermissoes"
      >
        {{ mostrarTblPermissoes ? "Ocultar" : "Mostrar" }} usuários e
        permissões</q-btn
      >
      <q-table
        v-if="mostrarTblPermissoes"
        title="Usuários e permissões"
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
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
      <div>
        <q-btn label="Enviar" type="submit" color="primary" />
        <q-btn
          label="Limpar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { API_URL } from "../../helper/constants.js";
import { date, Notify } from "quasar";

onMounted(() => {
  if ("id" in route.params) {
    // modo de edição
    modoEdicao.value = true;
    id.value = +route.params.id;

    axios.get(`${API_URL}v1/restrito/inventario/${id.value}`).then((res) => {
      const inventario = res.data;
      nomeInventario.value = inventario.nome;
      dataCriacao.value = date.formatDate(
        inventario.dataCadastro,
        "DD/MM/YYYY"
      );
      statusAtual.value = inventario.situacaoInventario;
      inventarioDescricao.value = inventario.descricao;
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

const id = ref(0);
const modoEdicao = ref(false);
const route = useRoute();
const router = useRouter();
const mostrarTblPermissoes = ref(false);
const dataCriacao = ref("30/06/2022");
const selected = reactive([]);
const inventarioDescricao = ref("");
const statusAtual = ref("");
const statusOpcoes = reactive([
  "PREPARANDO",
  "INVENTARIANDO",
  "SUSPENSO",
  "FECHADO",
]);
const nomeInventario = ref("");
const usuarios = ref([
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
  {
    id: Math.random(),
    usuario: "João",
    siape: "1234567",
    email: "joao@ufjf.br",
  },
]);
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
</script>
