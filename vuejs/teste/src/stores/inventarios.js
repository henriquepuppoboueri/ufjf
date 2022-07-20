import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useInventariosStore = defineStore({
  id: 'inventarios',
  state: () => ({
    inventarios: [],
    usuariosInventario: [],
    carregando: false,
    erro: null,
    inventario: null
  }),
  getters: {
  },
  actions: {
    addInventario() { },
    delInventario() { },
    editInventario() { },
    buscarInventarios() { },
    async buscarInventario(idInventario) {
      const usuariosInventarioResponse = await api.get(
        `v1/restrito/inventario/usuario/${idInventario}`
      );
      usuariosInventario = usuariosInventarioResponse.data;
    },

  }
})
