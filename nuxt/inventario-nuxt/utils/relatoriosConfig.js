export const relatoriosLista = [
  {
    nome: 'local-diferente',
    descricao: 'Bens em outras unidades',
    url: 'relatorios/localDiferente/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    itemTipo: 'itemColetado',
    colunasVisiveis: [
      'patrimonio',
      'identificador',
      'descricao',
      'localizacao',
      'setorEncontrado',
      'setorPrevisto',
      'dependenciaEncontrada',
      'dependenciaPrevista',
      'usuario'
    ],
    filtros: ['setor', 'dependencia']
  },
  {
    nome: 'localizacoes',
    descricao: 'Localizações dos itens coletados',
    url: 'relatorios/localizacoes/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    colunasVisiveis: [
      'patrimonio',
      'identificador',
      'descricao',
      'localizacao',
    ],
    filtros: [],
    componente: {
      padrao: false,
      nome: 'RelLocalizacoesItens'
    }
  },
  {
    nome: 'por-situacao',
    descricao: 'Por situação dos itens coletados',
    url: 'relatorios/porSituacao/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}&idSituacao=${idSituacao}',
    colunasVisiveis: [
      'patrimonio',
      'identificador',
      'descricao',
      'localizacao',
    ],
    filtros: ['setor', 'dependencia', 'situacao']
  },
  {
    nome: 'problema-plaqueta',
    descricao: 'Plaquetas com problemas',
    url: 'relatorios/problemaNaPlaqueta/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    itemTipo: 'itemColetado',
    colunasVisiveis: [
      'patrimonio',
      'descricao',
      'localizacao',
      'setorEncontrado',
      'dependenciaEncontrada',
      'estadoPlaqueta',
    ],
    filtros: ['setor', 'dependencia', 'estadoPlaqueta']

  },
  {
    nome: 'repetidos',
    descricao: 'Coletas repetidas',
    url: 'relatorios/repetidos/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    itemTipo: 'itemColetado',
    colunasVisiveis: [],
  },
  {
    nome: 'sem-coleta',
    descricao: 'Bens sem coleta',
    url: 'relatorios/semColeta/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    itemTipo: 'itemImportado',
    colunasVisiveis: ['patrimonio', 'descricao'],
    filtros: ['setor', 'dependencia']
  },
  {
    nome: 'coletas-sem-itens',
    descricao: 'Bens coletados sem itens',
    url: 'relatorios/semItem/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    itemTipo: 'itemColetado',
    colunasVisiveis: [
      'patrimonio',
      'descricao',
      'localizacao',
      'setorEncontrado',
      'setorPrevisto',
      'dependenciaEncontrada',
      'dependenciaPrevista',
    ],
    filtros: ['setor', 'dependencia']
  },
  {
    nome: 'sem-patrimonio',
    descricao: 'Bens sem patrimônio',
    url: 'relatorios/semPatrimonio/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}',
    colunasVisiveis: [
      'patrimonio',
      'descricao',
      'localizacao',
      'setorEncontrado',
      'dependenciaEncontrada',
    ],
    filtros: ['setor', 'dependencia']
  },
]

export const relatorioColunas = [
  {
    name: 'patrimonio',
    align: 'left',
    label: 'PATRIMÔNIO',
    field: 'patrimonio',
    sortable: true,
  },
  {
    name: 'identificador',
    align: 'left',
    label: 'IDENTIFICADOR',
    field: 'identificador',
    sortable: true,
  },
  {
    name: 'descricao',
    align: 'left',
    label: 'DESCRIÇÃO',
    field: 'descricao',
    sortable: true,
  },
  {
    name: 'setorEncontrado',
    align: 'left',
    label: 'SETOR ENCONTRADO',
    field: 'setorEncontrado',
    sortable: true,
  },
  {
    name: 'setorPrevisto',
    align: 'left',
    label: 'SETOR PREVISTO',
    field: 'setorPrevisto',
    sortable: true,
  },
  {
    name: 'dependenciaEncontrada',
    align: 'left',
    label: 'DEP. ENCONTRADA',
    field: 'dependenciaEncontrada',
    sortable: true,
  },
  {
    name: 'dependenciaPrevista',
    align: 'left',
    label: 'DEP. PREVISTA',
    field: 'dependenciaPrevista',
    sortable: true,
  },
  {
    name: 'localizacao',
    align: 'left',
    label: 'LOCALIZAÇÃO',
    field: 'localizacao',
    sortable: true,
  },
  {
    name: 'estadoPlaqueta',
    align: 'left',
    label: 'ESTADO PLAQUETA',
    field: 'estadoPlaqueta',
    sortable: true,
  },
  {
    name: 'qtde',
    align: 'left',
    label: 'QUANTIDADE',
    field: 'qtde',
    sortable: true,
  },
  {
    name: 'usuario',
    align: 'left',
    label: 'USUÁRIO',
    field: 'usuario',
    sortable: true,
  },
];