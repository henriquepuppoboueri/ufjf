<template>
  <div class="q-pa-md q-gutter-sm">
    <label for="select_inventarios">Selecione o Inventário: </label>
    <select id="select_inventarios" v-model="pes_selecionada">
      <option
        v-for="item in inventariosNaoFechados"
        :key="item.nome"
        :value="item"
      >
        {{ item.nome }}
      </option>
    </select>

    <br />
    <label for="select_inventarios">Setor: </label
    ><input v-model="vSetor" type="text" />

    <br />
    <label for="select_inventarios">Dependência: </label
    ><input v-model="depend" type="text" />
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
    <br /><button @click="limpar()">Limpar</button> <br /><button
      @click="importar()"
    >
      Importar Dados</button
    ><label>{{ vmensagem }}</label>

    <div v-if="retorno.length > 0">
      <hr />
      <table id="table_detail" border="1">
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
      id="table_detail"
      border="1"
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
            <td v-if="linha.length == 12" style="color: blue">{{ campo }}</td>
            <td v-if="linha.length != 12" style="color: red">{{ campo }}</td>
          </template>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
const api = { get: $fetch.native };

export default {
  data() {
    return {
      vSetor: 'ICBV',
      depend: 'Farmácia',
      arquivo: '',
      lines: '',
      linhas: [],
      linhas2: [],
      nomeArquivo: '',
      mensagem: '',
      vjson: '',
      vJsonEmLinhas: [],
      pes_selecionada: '',
      inventariosNaoFechados: [{ nome: 'op 1' }, { nome: 'op 2' }],
      vmensagem: '',
      retorno: [],
    };
  },
  created() {
    this.obtemInventariosEmPreparacao();
  },
  methods: {
    obtemInventariosEmPreparacao() {
      this.inventariosNaoFechados = {};
      api
        .get('v1/restrito/inventario_preparando')
        .then((res) => {
          this.inventariosNaoFechados = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    camposValidos() {
      let retorno = false;
      if (!this.pes_selecionada) {
        console.log('Selecione o inventário.');
      } else {
        retorno = true;
      }
      return retorno;
    },
    importar() {
      this.vmensagem = '   Importando...';

      if (this.camposValidos()) {
        // Pega o arquivo convertido em JSON e salva na API
        let dados = {
          dependencia: '',
          setor: '',
          id: 0,
          inventario: {},
          itens: [],
        };
        this.retorno = [];
        dados.dependencia = this.depend;
        dados.setor = this.vSetor;
        dados.inventario = this.pes_selecionada;

        this.vJsonEmLinhas.forEach((element) => {
          dados.itens.push(element);
        });

        api
          .post('v1/restrito/item/itens', dados)
          .then((res) => {
            this.retorno = res.data;

            this.vmensagem = '  Importado.';
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log('Um ou mais campos inválidos');
      }
    },
    limpar() {
      this.linhas = [];
      this.linhas2 = [];
      this.vjson = '';
      this.vJsonEmLinhas = [];
      this.vmensagem = '';
      this.retorno = [];
    },
    loadTextFromFile(ev) {
      this.vmensagem = '   Carregando arquivo...';

      console.log('Iniciando leitura do arquivo...');
      const file = ev.target.files[0];
      this.nomeArquivo = file.name;
      this.mensagem = 'Carregando o arquivo ' + this.nomeArquivo;
      const reader = new FileReader('*.csv');

      // tenta separar o setor e a dependencia do nome do arquivo
      let partes = this.nomeArquivo.split(' - ');

      if (partes.length > 1) {
        if (partes.length > 0) {
          this.vSetor = partes[0];
        }
        if (partes.length >= 1) {
          let partes2 = partes[1].split('.csv');
          this.depend = partes2[0];
        }
      } else {
        this.vSetor = '';
        this.depend = '';
        console.log('Nome do arquivo não possue setor nem dependencia.');
      }

      reader.onload = (e) => {
        this.limpar();

        this.arquivo = e.target.result;
        this.lines = this.arquivo.split('\n');
        let n = 0;
        let LINHA_TITULO = 0;
        let campos = [];

        this.lines.forEach((linha) => {
          n++;

          console.log(this.mensagem);

          if (n > LINHA_TITULO) {
            campos = linha.split(';');

            // Determina qual é a linha do titulo
            if (campos[0] == 'Descriçăo') {
              LINHA_TITULO = n;
            }

            // Inverter a ordem dos campos
            let sopmac = [];
            for (let i = campos.length - 1; i >= 0; i--) {
              let element = campos[i];
              sopmac.push(element);
            }

            // Junta todos os campos após a posição 11 para formar a descrição
            let descricao = sopmac.slice(11).join(';');
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
              this.linhas.push(sopmac);
              //}
            } else {
              // Adiciona tantos patrimonios quanto tiverem no range
              for (let k = 0; k < qtde_pat; k++) {
                let novoPat = parseInt(num_pat_ini) + k;

                sopmac[3] = novoPat;
                let novo = sopmac.slice();

                this.linhas.push(novo);
              }
            }
          } else {
            console.log(
              'Desconsiderando a linha ' +
                n +
                ' por ser anterior à linha titulo ' +
                LINHA_TITULO
            );
          }
        });

        // Exclui as primeiras linhas até antes do cabecalho das colunas
        this.linhas2 = [];
        for (let x = LINHA_TITULO - 1; x < this.linhas.length; x++) {
          this.linhas2.push(this.linhas[x]);
        }

        //Troca o nome da coluna "Final" para "Patrimonio"
        this.linhas2[0][3] = 'Patrimonio';

        // TIRA AS COLUNAS DESNECESSÁRIAS
        let linhas3 = [];
        this.linhas2.forEach((element) => {
          // pega somente campos determinados
          let novaLinhaReduzida = element.slice(9, 12);
          novaLinhaReduzida.unshift(element[3]); // adiciona o número do Patrimonio no inicio da nova linha
          linhas3.push(novaLinhaReduzida);
        });

        this.vjson = this.converteToJson(linhas3);

        this.vmensagem = '   ';
      };
      //reader.readAsText(file, "UTF-8");
      reader.readAsText(file, 'iso-8859-2');
    },
    parseValor(v) {
      let retorno = v.replace(';', ' ');
      retorno = v.replace('"', ' ');
      retorno = v.replace(/"/g, ' ');
      return retorno;
    },
    parseTitulo(t) {
      let retorno = t;
      retorno = retorno.replace(' ', '_'); // trocar espaço por underscore
      retorno = retorno.replace('/', ''); // tirar a barra
      retorno = retorno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // tirar acentos
      return '[' + retorno + ']';
    },
    converteToJson(array) {
      let retorno = '';
      let camposTitulo = array[0]; // assume que a primeira linha é de titulos
      let separadorObjeto = '';

      for (let i = 1; i < array.length; i++) {
        let item = {
          patrimonio: '',
          fornecedor: '',
          empenho: '',
          descricao: '',
        };

        // monta a linha de retorno no formato JSON
        let linhaRetorno = separadorObjeto + '{ ';
        let separador = '';
        const linha = array[i];
        for (let c = 0; c < camposTitulo.length; c++) {
          //c = coluna
          let colunaTitulo = camposTitulo[c];
          const colunaValor = linha[c];
          linhaRetorno +=
            separador +
            ' "' +
            this.parseTitulo(colunaTitulo.trim()) +
            '": "' +
            this.parseValor(String(colunaValor).trim()) +
            '"';
          separador = ', ';

          if (this.parseTitulo(colunaTitulo.trim()) == '[Descricao]') {
            item.descricao = this.parseValor(String(colunaValor).trim());
          }
          if (this.parseTitulo(colunaTitulo.trim()) == '[Empenho]') {
            item.empenho = this.parseValor(String(colunaValor).trim());
          }
          if (this.parseTitulo(colunaTitulo.trim()) == '[Fornecedor]') {
            item.fornecedor = this.parseValor(String(colunaValor).trim());
          }
          if (this.parseTitulo(colunaTitulo.trim()) == '[Patrimonio]') {
            item.patrimonio = this.parseValor(String(colunaValor).trim());
          }
        }
        linhaRetorno += '} ';

        retorno += linhaRetorno;
        separadorObjeto = ', ';

        this.vJsonEmLinhas.push(item);
      }
      //
      return '[' + retorno + ']';
    },
  },
};
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
