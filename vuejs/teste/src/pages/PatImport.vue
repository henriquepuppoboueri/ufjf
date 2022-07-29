<template>
  <div class="col q-gutter-y-sm q-pa-sm">
    <p class="text-center text-h4">Importação de arquivo</p>
    <q-select
      v-model="inventario"
      :options="inventarios"
      :option-label="(item) => item.nome"
      :option-value="(item) => item.nome"
      label="Inventário"
      outline
    />
    <q-input outline v-model="vSetor" label="Setor" />
    <q-input outline v-model="depend" label="Dependência" />

    <q-input
      stack-label
      type="file"
      outline
      v-model="ph"
      label="Arquivo"
      class="fit"
      @change="loadTextFromFile"
    />

    <div class="q-gutter-x-sm q-mt-lg">
      <q-btn label="Limpar" color="primary" @click="limpar" />
      <q-btn label="Importar dados" color="green" @click="importar" />
    </div>

    <p>{{ vmensagem }}</p>
    <p>{{ mensagem }}</p>

    <!-- <label for="select_inventarios">Selecione o Inventário: </label>
    <select v-model="pes_selecionada" id="select_inventarios">
      <option
        v-for="item in inventariosNaoFechados"
        :value="item"
        :key="item.nome"
      >
        {{ item.nome }}
      </option>
    </select>
    <br />
    <label for="select_inventarios">Setor: </label
    ><input type="text" v-model="vSetor" />

    <br />
    <label for="select_inventarios">Dependência: </label
    ><input type="text" v-model="depend" />
    <br />
    <label class="text-reader">
      Selecionar arquivo
      <input type="file" @change="loadTextFromFile" />
    </label>
    <br />
    <br />
    <b
      ><label>{{ mensagem }}</label></b
    >
    <br /><button v-on:click="limpar()">Limpar</button> <br /><button
      v-on:click="importar()"
    >
      Importar Dados</button
    ><label>{{ vmensagem }}</label> -->

    <div v-if="retorno.length > 0">
      <hr />
      <table border="1" id="table_detail">
        <br />Inventario:
        {{
          pes_selecionada.nome
        }}
        <br />Arquivo...:
        {{
          nomeArquivo
        }}
        <caption></caption>

        <template v-for="linhaRetorno in retorno" :key="linhaRetorno.nome">
          <tr>
            <td>{{ linhaRetorno.nome }}</td>
            <td>{{ linhaRetorno.qtde }}</td>
          </tr>
        </template>
      </table>
    </div>

    <hr />

    <table
      border="1"
      id="table_detail"
      align="center"
      cellpadding="10"
      class="novo"
    >
      <caption>
        LISTA DE REGISTROS
      </caption>
      <template v-for="linha in linhas2" :key="linha.id">
        <tr>
          <template v-for="campo in linha" :key="campo.linha">
            <td style="color: blue" v-if="linha.length == 12">{{ campo }}</td>
            <td style="color: red" v-if="linha.length != 12">{{ campo }}</td>
          </template>
        </tr>
      </template>
    </table>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useInventariosStore } from "src/stores/inventarios";
import { storeToRefs } from "pinia";

const inventariosStore = useInventariosStore();
const { inventarios, inventario } = storeToRefs(inventariosStore);
const vSetor = ref("ICBV");
const depend = ref("Farmácia");
const arquivo = ref("");
const lines = ref("");
const linhas = ref([]);
const linhas2 = ref([]);
const nomeArquivo = ref("");
const mensagem = ref("");
const vjson = ref("");
const vJsonEmLinhas = ref([]);
const pes_selecionada = ref("");
const inventariosNaoFechados = ref([]);
const vmensagem = ref("");
const retorno = ref([]);

onMounted(() => {
  inventariosStore.buscarInventariosEmPreparacao();
});

function camposValidos() {
  let retorno = false;
  if (!pes_selecionada.value) {
    console.log("Selecione o inventário.");
  } else {
    retorno.value = true;
  }
  return retorno;
}
function importar() {
  vmensagem.value = "   Importando...";

  if (camposValidos()) {
    // Pega o arquivo convertido em JSON e salva na API
    let dados = {
      dependencia: "",
      setor: "",
      id: 0,
      inventario: {},
      itens: [],
    };
    retorno.value = [];
    dados.dependencia = depend.value;
    dados.setor = vSetor.value;
    dados.inventario = pes_selecionada.value;

    vJsonEmLinhas.value.forEach((element) => {
      dados.itens.push(element);
    });

    api
      .post("v1/restrito/item/itens", dados.value)
      .then((res) => {
        retorno.value = res.data;

        vmensagem.value = "  Importado.";
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("Um ou mais campos inválidos");
  }
}
function limpar() {
  linhas.value = [];
  linhas2.value = [];
  vjson.value = "";
  vJsonEmLinhas.value = [];
  vmensagem.value = "";
  retorno.value = [];
}

function loadTextFromFile(ev) {
  vmensagem.value = "   Carregando arquivo...";

  console.log("Iniciando leitura do arquivo...");
  const file = ev.target.files[0];
  nomeArquivo.value = file.name;
  mensagem.value = "Carregando o arquivo " + nomeArquivo.value;
  const reader = new FileReader("*.csv");

  // tenta separar o setor e a dependencia do nome do arquivo
  let partes = nomeArquivo.value.split(" - ");

  if (partes.length > 1) {
    if (partes.length > 0) {
      vSetor.value = partes[0];
    }
    if (partes.length >= 1) {
      let partes2 = partes[1].split(".csv");
      depend.value = partes2[0];
    }
  } else {
    vSetor.value = "";
    depend.value = "";
    console.log("Nome do arquivo não possue setor nem dependencia.");
  }

  reader.onload = (e) => {
    limpar();

    arquivo.value = e.target.result;
    lines.value = arquivo.value.split("\n");
    let n = 0;
    let LINHA_TITULO = 0;
    let campos = [];

    lines.value.forEach((linha) => {
      n++;

      console.log(mensagem.value);

      if (n > LINHA_TITULO) {
        campos = linha.split(";");

        // Determina qual é a linha do titulo
        if (campos[0] == "Descriçăo") {
          LINHA_TITULO = n;
        }

        // Inverter a ordem dos campos
        let sopmac = [];
        for (let i = campos.length - 1; i >= 0; i--) {
          let element = campos[i];
          sopmac.push(element);
        }

        // Junta todos os campos após a posição 11 para formar a descrição
        let descricao = sopmac.slice(11).join(";");
        sopmac = sopmac.slice(0, 11);

        let qtde_pat = 1;
        let num_pat_ini = sopmac.at(4);
        let num_pat_fim = sopmac.at(3);
        if (n > LINHA_TITULO) {
          // Se não for a linha do titulo, então calcula quantos patrimônios a linha se refere.
          try {
            qtde_pat = num_pat_fim - num_pat_ini + 1;
          } catch (error) {
            qtde_pat = 1;
          }
        }

        sopmac.push(descricao);
        if (qtde_pat == 1) {
          //if (n > LINHA_TITULO) {
          linhas.value.push(sopmac);
          //}
        } else {
          // Adiciona tantos patrimonios quanto tiverem no range
          for (let k = 0; k < qtde_pat; k++) {
            let novoPat = parseInt(num_pat_ini) + k;

            sopmac[3] = novoPat;
            let novo = sopmac.slice();

            linhas.value.push(novo);
          }
        }
      } else {
        console.log(
          "Desconsiderando a linha " +
            n +
            " por ser anterior à linha titulo " +
            LINHA_TITULO
        );
      }
    });

    // Exclui as primeiras linhas até antes do cabecalho das colunas
    linhas2.value = [];
    for (let x = LINHA_TITULO - 1; x < linhas.value.length.value; x++) {
      linhas2.value.push(linhas.value[x]);
    }

    //Troca o nome da coluna "Final" para "Patrimonio"
    linhas2.value[0][3] = "Patrimonio";

    // TIRA AS COLUNAS DESNECESSÁRIAS
    let linhas3 = [];
    linhas2.value.forEach((element) => {
      // pega somente campos determinados
      let novaLinhaReduzida = element.slice(9, 12);
      novaLinhaReduzida.unshift(element[3]); // adiciona o número do Patrimonio no inicio da nova linha
      linhas3.push(novaLinhaReduzida);
    });

    vjson.value = converteToJson.value(linhas3);

    vmensagem.value = "   ";
  };
  //reader.readAsText(file, "UTF-8");
  reader.readAsText(file, "iso-8859-2");
}

function parseValor(v) {
  let retorno = v.replace(";", " ");
  retorno = v.replace('"', " ");
  retorno = v.replace(/"/g, " ");
  return retorno;
}
function parseTitulo(t) {
  let retorno = t;
  retorno = retorno.replace(" ", "_"); // trocar espaço por underscore
  retorno = retorno.replace("/", ""); // tirar a barra
  retorno = retorno.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // tirar acentos
  return "[" + retorno + "]";
}

function converteToJson(array) {
  let retorno = "";
  let camposTitulo = array[0]; // assume que a primeira linha é de titulos
  let separadorObjeto = "";

  for (let i = 1; i < array.length; i++) {
    let item = {
      patrimonio: "",
      fornecedor: "",
      empenho: "",
      descricao: "",
    };

    // monta a linha de retorno no formato JSON
    let linhaRetorno = separadorObjeto + "{ ";
    let separador = "";
    const linha = array[i];
    for (let c = 0; c < camposTitulo.length; c++) {
      //c = coluna
      let colunaTitulo = camposTitulo[c];
      const colunaValor = linha[c];
      linhaRetorno +=
        separador +
        ' "' +
        parseTitulo(colunaTitulo.trim()) +
        '": "' +
        parseValor(String(colunaValor).trim()) +
        '"';
      separador = ", ";

      if (parseTitulo(colunaTitulo.trim()) == "[Descricao]") {
        item.descricao = parseValor(String(colunaValor).trim());
      }
      if (parseTitulo(colunaTitulo.trim()) == "[Empenho]") {
        item.empenho = parseValor(String(colunaValor).trim());
      }
      if (parseTitulo(colunaTitulo.trim()) == "[Fornecedor]") {
        item.fornecedor = parseValor(String(colunaValor).trim());
      }
      if (parseTitulo(colunaTitulo.trim()) == "[Patrimonio]") {
        item.patrimonio = parseValor(String(colunaValor).trim());
      }
    }
    linhaRetorno += "} ";

    retorno += linhaRetorno;
    separadorObjeto = ", ";

    vJsonEmLinhas.value.push(item);
  }
  //
  return "[" + retorno + "]";
}
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button style 😎 */
  border: 2px solid black;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
