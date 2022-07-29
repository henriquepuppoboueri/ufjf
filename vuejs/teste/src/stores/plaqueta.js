import { defineStore } from 'pinia';
import { api } from 'boot/axios';


export const usePlaquetaStore = defineStore({
  id: 'plaqueta',
  state: () => ({
    estadosPlaquetas: [],
    estadoPlaqueta: null,
    carregando: false,
    erro: null,
  }),
  actions: {
    async buscarEstadosPlaquetas() {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/estadoplaqueta`)
        if (response.data.length > 0)
          this.estadosPlaquetas = await response.data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },
    async buscarEstadoPlaqueta(idEstadoPlaqueta) {
      if (this.estadosPlaquetas.length > 0) {
        const estado = this.estadosPlaquetas.find(estado => estado.id === idEstadoPlaqueta)
        this.estadoPlaqueta = estado
        return estado
      }
    }
  }
});
