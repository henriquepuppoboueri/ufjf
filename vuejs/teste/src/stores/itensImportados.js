import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useSetoresStore } from 'src/stores/setores'

const setoresStore = useSetoresStore()

export const useItensImportadosStore = defineStore({
  id: 'itensImportados',
  state: () => ({
    itensImportados: [],
    itensColetados: [],
    itemImportado: null,
    itemColetado: null,
    tipoGetter: '',
    carregando: false,
    erro: null,
  }),
  getters: {
    itensNominais(state) {
      try {
        state.carregando = true;
        const itens = state.tipoGetter === 'coletados' ? state.itensColetados : state.itensImportados

        if (itens.length > 0) {
          return itens.map(item => {
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
            };
          })
        }
      } catch (error) {

      } finally {
      }

    }
  },
  actions: {
    async addItemColetado() {
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
        const response = await api.delete(`v1/restrito/coleta/${idItem}`, item)
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


    async buscarItensImportados(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/itens/${idInventario}`)
        if (response.data.length > 0)
          this.itensImportados = await response.data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async buscarItemImportado(idItem) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/${idItem}`)
        this.itemImportado = await response.data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    }
  }
});
