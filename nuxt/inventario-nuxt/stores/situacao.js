export const useSituacaoStore = defineStore('situacao', () => {
  const situacao = ref(null);
  const situacoes = ref([]);
  const carregando = ref(false);
  const erro = ref(null);

  function buscarSituacaoPorId(idSituacao) {
    const situacao = situacoes.value.find(situacao => situacao.id === idSituacao)
    // console.log(situacao);
    return situacao || 'Sem situação'
  }

  async function buscarSituacoes() {
    try {
      carregando.value = true
      const data = await useCustomFetch('situacao')
      if (data) {
        situacoes.value = data
      }
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarSituacao(idSituacao) {
    try {
      carregando.value = true
      const { data } = await useCustomFetch(`situacao/${idSituacao}`)
      if (data) {
        situacao.value = await data
        return await data
      }
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  function $resetSituacao() {
    situacao.value = null
  }

  return {
    situacao,
    situacoes,
    carregando,
    erro,
    buscarSituacaoPorId,
    buscarSituacoes,
    buscarSituacao,
    $resetSituacao,
  }

})
/*
export const useSituacaoStore2 = defineStore({
  id: 'situacao',
  state: () => ({
    situacoes: [],
    situacao: null,
    carregando: false,
    erro: null,
  }),
  actions: {
    buscarSituacaoPorId(idSituacao) {
      const situacao = this.situacoes.find(situacao => situacao.id === idSituacao)
      // console.log(situacao);
      return situacao || 'Sem situação'
    },
    async buscarSituacoes() {
      try {
        this.carregando = true
        const response = await api.get('v1/restrito/situacao')
        if (response) {
          this.situacoes = await response.data
        }
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },
    async buscarSituacao(idSituacao) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/situacao/${idSituacao}`)
        if (response) {
          this.situacao = await response.data
          return await response.data
        }
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    }
  }
})*/
