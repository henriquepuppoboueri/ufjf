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
    async addInventario(inventario) {
      const inventarioResponse = await api
        .post(`v1/restrito/inventario`, inventario)
    },

    async delInventario(idInventario) {
      const res = await api
        .delete(`v1/restrito/inventario/${idInventario}`)
      return res.status
    },

    async editInventario(idInventario, inventario) {
      await api
        .put(`v1/restrito/inventario/${idInventario}`, inventario)
    },

    async buscarInventario(idInventario) {
      const inventarioResponse = await api.get(
        `v1/restrito/inventario/${idInventario}`
      );
      this.inventario = inventarioResponse.data
    },

    async buscarInventarios() {
      const inventariosResponse = await api.get(`v1/restrito/inventario`)
      this.inventarios = inventariosResponse.data
    },

    async addUsuarioInventario(idInventario, usuario) {
      await api
        .post(`v1/restrito/inventario/usuario/${idInventario}`, usuario)
    },

    async buscarUsuariosInventario(idInventario) {
      const usuariosInventarioResponse = await api.get(
        `v1/restrito/inventario/usuario/${idInventario}`
      );
      this.usuariosInventario = usuariosInventarioResponse.data
    },

  }
})
