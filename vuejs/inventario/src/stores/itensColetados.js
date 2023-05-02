import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useSetoresStore } from 'src/stores/setores'
import { useSituacaoStore } from './situacao';
import { usePlaquetaStore } from './plaqueta';
import { useDependenciasStore } from './dependencias';

const setoresStore = useSetoresStore()
const dependenciasStore = useDependenciasStore();
const situacaoStore = useSituacaoStore()
const plaquetaStore = usePlaquetaStore()

situacaoStore.buscarSituacoes()
plaquetaStore.buscarEstadosPlaquetas()

export const useItensColetadosStore = defineStore({
  id: 'itensColetados',
  state: () => ({
    itensColetados: [],
    itemColetado: {
      patrimonio: '', identificador: '', descricao: '',
      setor: { id: null, nome: null, dependencias: [] },
      dependencia: null, localizacao: "",
      situacao: '', estadoPlaqueta: null, observacao: '', usuario: ''
    },
    carregando: false,
    erro: null,
  }),
  getters: {
    async itemNominal(state) {
      try {
        state.carregando = true
        if (state.itemColetado) {
          const setor = await setoresStore.buscarSetor(state.itemColetado.idSetor)
          const dependencia = await dependenciasStore.buscarDependencia(state.itemColetado.idDependencia)
          const situacao_ = await situacaoStore.buscarSituacao(state.itemColetado.situacao)
          const estadoPlaqueta = await plaquetaStore.buscarEstadoPlaqueta(state.itemColetado.idEstadoPlaqueta)
          return { ...state.itemColetado, setor, dependencia, situacao_, estadoPlaqueta }
        }
      } catch (error) {
        state.erro = error
      }
    },
    itensNominais(state) {
      try {
        state.carregando = true

        if (state.itensColetados.length > 0) {
          const itensLista = state.itensColetados.map((item) => {
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
            // const itemCorrigido = {
            //   ...item,
            //   setor: setor.nome,
            //   dependencia: dependenciaNome,
            //   situacao,
            //   estadoPlaqueta
            // }
            // console.log(itemCorrigido);
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
        const response = await api.post(`v1/restrito/coleta`, item)
        return response;
      } catch (error) {
        this.erro = error;
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
        this.carregando = true
        const response = await api.get(`v1/restrito/item/coleta/${idInventario}`)
        if (response.data.length > 0)
          this.itensColetados = await response.data
      } catch (error) {
        this.erro = error;
      } finally {
        this.carregando = false;
      }
    },

    async buscarItemColetado(idItem) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/coleta/${idItem}`)
        this.itemColetado = await response.data

        const setor = await setoresStore.buscarSetor(this.itemColetado.idSetor)
        const dependencia = await dependenciasStore.buscarDependencia(this.itemColetado.idDependencia)
        const situacao_ = await situacaoStore.buscarSituacao(this.itemColetado.situacao)
        const estadoPlaqueta = await plaquetaStore.buscarEstadoPlaqueta(this.itemColetado.idEstadoPlaqueta)
        this.itemColetado = { ...this.itemColetado, setor, dependencia, situacao_, estadoPlaqueta }
        return this.itemColetado
      } catch (error) {
        this.erro = error;
      } finally {
        this.carregando = false
      }
    },
    limparItemColetado() {
      this.itemColetado = {
        patrimonio: '', identificador: '', descricao: '',
        setor: { id: null, nome: null, dependencias: [] },
        dependencia: null, localizacao: "",
        situacao: '', estadoPlaqueta: null, observacao: '', usuario: ''
      }
    }
  }
});
