import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useItemsStore = defineStore({
  id: 'items',
  state: () => ({
    items: [],
    carregando: false,
    erro: null
  }),
  getters: {},
  actions: {
    async addItemColetado(item) {

    },

    async editItemColetado(idItem, item) {

    },

    async delItemColetado(idItem) {

    },

    async buscarItemsColetados() {

    },

    async buscarItemColetado(idItem) {

    },

    async buscarItemsOriginais() {

    },

    async buscarItemOriginal(idItem) {

    }
  }
});
