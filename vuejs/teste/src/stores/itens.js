import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useItensStore = defineStore({
  id: 'items',
  state: () => ({
    items: [],
    carregando: false,
    erro: null,
    item: null
  }),
  getters: {},
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
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarItemColetado(idItem) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/coleta/${idItem}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },


    async buscarItensOriginais(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/itens/${idInventario}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarItemOriginal(idItem) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/${idItem}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    }
  }
});
