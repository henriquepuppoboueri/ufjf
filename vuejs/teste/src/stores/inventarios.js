import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import lodash from 'lodash'

export const useInventariosStore = defineStore({
  id: 'inventarios',
  state: () => ({
    inventarios: [],
    usuariosInventario: [{ id: 1, nome: 'Novo 4444', cpf: '03667333625', email: 'jpaniceto@gmail.com', login: 'novo' }],
    carregando: false,
    erro: null,
    inventario: null
  }),
  getters: {
  },
  actions: {

    async liberarInventario(idInventario) {
      try {
        const inventarioResponse = await api
          .patch(`v1/restrito/inventario/liberar/${idInventario}`)
        return inventarioResponse.status
      } catch (error) {
        throw new Error(error.response.data)

      }
    },
    async fecharInventario(idInventario) {
      try {
        const inventarioResponse = await api
          .patch(`v1/restrito/inventario/fechar/${idInventario}`)
        return inventarioResponse.status
      } catch (error) {
        throw new Error(error.message)
      }
    },

    async addInventario(inventario) {
      const inventarioResponse = await api
        .post(`v1/restrito/inventario`, inventario)
      this.buscarInventarios();
    },

    async delInventario(idInventario) {
      const res = await api
        .delete(`v1/restrito/inventario/${idInventario}`)
      this.buscarInventarios();
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
      // return this.inventarios;
    },

    async buscarInventariosEmPreparacao() {
      const inventariosResponse = await api.get(`v1/restrito/inventario_preparando`)
      this.inventarios = inventariosResponse.data
      // return this.inventarios;
    },

    async addUsuarioInventario(idInventario, usuario) {
      await api
        .post(`v1/restrito/inventario/usuario/${idInventario}`, usuario)
      await this.buscarUsuariosInventario(idInventario);
    },

    async delUsuarioInventario(idInventario, idUsuario) {
      await api
        .delete(`v1/restrito/inventario/usuario/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async buscarUsuariosInventario(idInventario) {
      const usuariosInventarioResponse = await api.get(
        `v1/restrito/inventario/usuario/${idInventario}`
      );
      this.usuariosInventario = usuariosInventarioResponse.data;
    },

  }
})
