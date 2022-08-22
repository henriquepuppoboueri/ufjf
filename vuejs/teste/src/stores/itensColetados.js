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
    itemColetado: null,
    carregando: false,
    erro: null,
  }),
  getters: {
    itensNominais(state) {
      try {
        state.carregando = true;

        if (state.itensColetados.length > 0) {
          const itensLista = state.itensColetados.map(item => {
            const situacao = situacaoStore.buscarSituacaoPorId(item.situacao).nome
            const estadoPlaqueta = plaquetaStore.buscarEstadoPlaqueta(item.idEstadoPlaqueta).nome
            const setor = setoresStore.buscarSetorPorId(item.setor)
            let dependenciaNome = 'Sem dependência'
            if (
              setor !== "Sem setor" &&
              setor.hasOwnProperty("dependencias") & (setor.dependencias.length > 0)
            ) {
              const dependencia = setor.dependencias.find((dep) => dep.id === item.dependencia)
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
      }
    }
  },
  actions: {
    async addItemColetado(item) {
      try {
        this.carregando = true
        console.log(item);
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
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarItensColetados(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/coleta/${idInventario}`)
        if (response.data.length > 0)
          this.itensColetados = await response.data
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
