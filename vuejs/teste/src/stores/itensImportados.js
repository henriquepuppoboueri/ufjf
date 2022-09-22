import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useSetoresStore } from 'src/stores/setores'

const setoresStore = useSetoresStore()

export const useItensImportadosStore = defineStore({
  id: 'itensImportados',
  state: () => ({
    itensImportados: [],
    itemImportado: null,
    carregando: false,
    erro: null,
  }),
  getters: {
    itensNominais(state) {
      try {
        state.carregando = true;

        if (state.itensImportados.length > 0) {
          return state.itensImportados.map(item => {
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
    },
    async buscarItemImportadoPorPatrimonio(patrimonio, idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`/v1/restrito/item/patrimonio/${patrimonio}&${idInventario}`)
        const data = await response.data
        this.itemImportado = data || null
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },
  }
});
