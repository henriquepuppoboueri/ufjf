import filtroItensColetadosModel from '/model/FiltroItensColetadosModel';

export const useItensColetadosStore = defineStore({
  id: 'itensColetados',
  state: () => ({
    paginacaoMeta: null,
    itensColetados: [],
    itensColetadosTodos: [],
    itemColetado: null,
    carregando: false,
    carregandoTodos: false,
    erro: null,
  }),
  getters: {
    async itemNominal(state) {
      try {
        const { buscarSituacao } = useSituacaoStore()
        const { buscarEstadoPlaqueta } = usePlaquetaStore()
        const { buscarSetor } = useSetoresStore()
        const { buscarDependencia } = useDependenciasStore()

        state.carregando = true
        if (state.itemColetado) {
          const setor = await buscarSetor(state.itemColetado.idSetor)
          const dependencia = await buscarDependencia(state.itemColetado.idDependencia)
          const situacao_ = await buscarSituacao(state.itemColetado.situacao)
          const estadoPlaqueta = await buscarEstadoPlaqueta(state.itemColetado.idEstadoPlaqueta)
          return { ...state.itemColetado, setor, dependencia, situacao_, estadoPlaqueta }
        }
      } catch (error) {
        state.erro = error
      }
    },
    itensNominais(state) {
      try {
        state.carregandoTodos = true
        const { buscarSituacaoPorId } = useSituacaoStore()
        const { buscarEstadoPlaqueta } = usePlaquetaStore()
        const { buscarSetorPorId } = useSetoresStore()


        if (state.itensColetadosTodos.length > 0) {
          const itensLista = state.itensColetadosTodos.map((item) => {
            const situacao = buscarSituacaoPorId(item.situacao.id).nome
            const estadoPlaqueta = buscarEstadoPlaqueta(item.estadoPlaqueta.id).nome
            const setor = buscarSetorPorId(item.setor.id)
            let dependenciaNome = 'Sem dependência'
            if (
              setor.nome !== "Sem setor" &&
              setor.hasOwnProperty("dependencias") & (setor.dependencias.length > 0)
            ) {
              const dependencia = setor.dependencias.find((dep) => dep.id === item.dependencia.id)
              if (dependencia) dependenciaNome = dependencia.nome
            }
            state.carregandoTodos = false;
            return {
              ...item,
              setor: setor.nome,
              dependencia: dependenciaNome,
              situacao,
              estadoPlaqueta
            }
          })
          return itensLista
        }
      } catch (error) {

      } finally {
      }
    }
  },
  actions: {
    async vincularItemPatrimonio(idColeta, idItem) {
      try {
        this.erro = null
        this.carregando = true
        const response = await api.patch(`v1/restrito/coleta/vincular/${idColeta}&${idItem}`)
        return response
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },

    async addItemColetado(item) {
      try {
        this.carregando = true
        const response = await api.post(`v1/restrito/coleta`, item)
        return response
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },

    async editItemColetado(idItem, item) {
      try {
        this.carregando = true
        const response = await api.put(`v1/restrito/coleta/${idItem}`, item)
        return response;
      } catch (error) {
        this.erro = error.response.data || null;
      } finally {
        this.carregando = false
      }
    },

    async delItemColetado(idItem) {
      try {
        this.carregando = true
        const response = await api.delete(`v1/restrito/coleta/${idItem}`)
        const itemIndex = this.itensColetados.findIndex(item => item.id === idItem)
        this.itensColetados.splice(itemIndex, 1)
        return response;
      } catch (error) {
        this.erro = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarItensColetados(idInventario) {
      try {
        this.carregandoTodos = true
        const response = await api.get(`v1/restrito/item/coleta/${idInventario}`)
        if (response.data.length > 0)
          this.itensColetadosTodos = await response.data
        console.log(this.itensColetadosTodos);
      } catch (error) {
        this.erro = error;
      } finally {
        this.carregandoTodos = false;
      }
    },

    async buscarItensColetadosPaginados(idInventario, filtroItensColetados = filtroItensColetadosModel) {
      try {
        this.carregando = true
        const data = await useCustomFetch(`coleta/inventario/page/${idInventario}`, { params: filtroItensColetados })
        if (data && data.content.length > 0)
          this.itensColetados = await data.content
        this.paginacaoMeta = await { ...data, content: null }
      } catch (error) {
        this.erro = error;
      } finally {
        this.carregando = false;
      }
    },

    async buscarItemColetado(idItem) {
      try {
        this.carregando = true
        const data = await useCustomFetch(`coleta/${idItem}`)
        if (!data)
          return

        this.itemColetado = await data
        const setor = await useSetoresStore().buscarSetor(this.itemColetado?.idSetor)
        const dependencia = await useDependenciasStore().buscarDependencia(this.itemColetado?.idDependencia)
        const situacao_ = await useSituacaoStore().buscarSituacao(this.itemColetado?.situacao)
        const estadoPlaqueta = usePlaquetaStore().buscarEstadoPlaqueta(this.itemColetado?.idEstadoPlaqueta)
        this.itemColetado = { ...this.itemColetado, setor, dependencia, situacao_, estadoPlaqueta }
        return this.itemColetado

      } catch (error) {
        this.erro = error;
      } finally {
        this.carregando = false
      }
    },
    $reset() {
      this.itemColetado = null
    },

    $novo() {
      this.itemColetado = {
        patrimonio: '', identificador: '', descricao: '',
        setor: { id: null, nome: null, dependencias: [] },
        dependencia: null, localizacao: "",
        situacao: '', estadoPlaqueta: null, observacao: '', usuario: ''
      }
    }
  }
});
