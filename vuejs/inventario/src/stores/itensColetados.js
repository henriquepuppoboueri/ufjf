import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useSetoresStore } from 'src/stores/setores'
import { useSituacaoStore } from './situacao';
import { usePlaquetaStore } from './plaqueta';

const setoresStore = useSetoresStore()
const situacaoStore = useSituacaoStore()
const plaquetaStore = usePlaquetaStore()
situacaoStore.buscarSituacoes()
plaquetaStore.buscarEstadosPlaquetas()

export const useItensColetadosStore = defineStore({
  id: 'itensColetados',
  state: () => ({
    itensColetados: [],
    paginacaoDados: {},
    itemColetado: null,
    carregando: false,
    erro: null,
  }),
  getters: {
    itensNominais(state) {
      try {
        state.carregando = true;


        if (state.itensColetados.content.length > 0) {
          const itensLista = state.itensColetados.map(item => {
            const situacao = situacaoStore.buscarSituacaoPorId(item.situacao).nome
            const estadoPlaqueta = plaquetaStore.buscarEstadoPlaqueta(item.idEstadoPlaqueta).nome
            const setor = setoresStore.buscarSetorPorId(item.idSetor)
            let dependenciaNome = 'Sem dependência'
            if (
              setor !== "Sem setor" &&
              setor.hasOwnProperty("dependencias") & (setor.dependencias.length > 0)
            ) {
              const dependencia = setor.dependencias.find((dep) => dep.id === item.idDependencia)
              if (dependencia) dependenciaNome = dependencia.nome
            }
            state.carregando = false;
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
        state.carregando = false;

      }
    }
  },
  actions: {
    async addItemColetado(item) {
      try {
        this.carregando = true
        const response = await api.post(`v1/restrito/coleta`, item)
        return response;
      } catch (error) {
        this.error = error;
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
        this.error = error;
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
        // const filtrados = this.itensColetados.filter(item => item.id !== idItem)
        // this.itensColetados = filtrados
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarItensColetados(idInventario, page = 0, rowsPerPage = 10, sortBy = 'id,asc', filter = '') {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/coleta2/${idInventario}`, {
          params: {
            page,
            rowsPerPage,
            sortBy,
            filter
          }
        })
        this.itensColetados = await response.data.content
        this.paginacaoDados = { ...response.data }
        delete this.paginacaoDados.content
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false;
      }
    },

    async buscarItemColetado(idItem) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/coleta/${idItem}`)
        this.itemColetado = await response.data
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
  }
});
