import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import lodash from 'lodash'

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
    // filtrarInventarios(state) {

    // }
  },
  actions: {
    async liberarInventario(idInventario) {
      try {
        const inventarioResponse = await api
          .patch(`v1/restrito/inventario/liberar/${idInventario}`)
        this.buscarInventarios();
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
      this.buscarInventarios()
    },

    async delInventario(idInventario) {
      const res = await api
        .delete(`v1/restrito/inventario/${idInventario}`)
      this.buscarInventarios()
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
      this.inventario = await inventarioResponse.data
    },

    async buscarInventarios(usuarioInventarios) {
      const inventariosResponse = await api.get(`v1/restrito/inventario`)
      const data = await inventariosResponse.data
      const idsInventariosUsuario = usuarioInventarios.map(usuarioInventario => usuarioInventario.idInventario)

      if (idsInventariosUsuario && data) {
        const filtro = data.filter(inventario => {
          return idsInventariosUsuario.includes(inventario.id)
        })
        this.inventarios = filtro
      } else {
        this.inventarios = data
      }
    },

    async buscarInventariosEmPreparacao() {
      const inventariosResponse = await api.get(`v1/restrito/inventario_preparando`)
      this.inventarios = await inventariosResponse.data
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
      this.usuariosInventario = await usuariosInventarioResponse.data;
    },

    async setUsuarioInventarioPresidente(idInventario, idUsuario) {
      const response = await api.patch(`/v1/restrito/inventario/usuario/presidente/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioNormal(idInventario, idUsuario) {
      const response = await api.patch(`/v1/restrito/inventario/usuario/normal/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioAdmin(idInventario, idUsuario) {
      const response = await api.patch(`/v1/restrito/inventario/usuario/admin/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioNaoAdmin(idInventario, idUsuario) {
      const response = await api.patch(`/v1/restrito/inventario/usuario/naoadmin/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    }
  }
})
