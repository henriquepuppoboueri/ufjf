import { defineStore } from 'pinia'


export const useInventariosStore = defineStore({
  id: 'inventarios',
  state: () => ({
    inventarios: [],
    usuariosInventario: [],
    carregando: false,
    erro: null,
    inventario: null
  }),
  persist: true,
  getters: {
    presidentes(state) {
      if (state.inventario && state.usuariosInventario) {
        return state.usuariosInventario.filter(usuario => usuario.presidente).map(_usuario => _usuario.nome)
      } else
        return []
    }
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

      const inventarioResponse = await useCustomFetch(
        `inventario/${idInventario}`
      );
      this.inventario = await inventarioResponse.data
    },

    async buscarInventarios(usuarioInventarios = []) {
      const inventariosData = await useCustomFetch(`inventario`)

      if (usuarioInventarios.length > 0 && inventariosData.value) {
        const filtro = inventariosData.filter(inventario => usuarioInventarios.includes(inventario.id))
        this.inventarios = filtro
      } else {
        this.inventarios = inventariosData
      }
    },

    async definirPresidente(idInventario, idUsuario) {
      try {
        this.carregando = true
        const { data } = await api.get(`v1/restrito/inventario/usuario/presidente/${idInventario}&${idUsuario}`)
        if (data)
          this.usuario = data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
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
      const { data: usuariosInventario } = await api.get(
        `v1/restrito/inventario/usuario/${idInventario}`
      );
      this.usuariosInventario = await usuariosInventario;
    },

    async setUsuarioInventarioPresidente(idInventario, idUsuario) {
      await api.patch(`/v1/restrito/inventario/usuario/presidente/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioNormal(idInventario, idUsuario) {
      await api.patch(`/v1/restrito/inventario/usuario/normal/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioAdmin(idInventario, idUsuario) {
      const response = await api.patch(`/v1/restrito/inventario/usuario/admin/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioNaoAdmin(idInventario, idUsuario) {
      const response = await api.patch(`/v1/restrito/inventario/usuario/naoadmin/${idInventario}&${idUsuario}`)
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioEmitenteRel(idInventario, idUsuario) {
      await api.patch(`/v1/restrito/inventario/usuario/emitente/${idInventario}&${idUsuario}`)
    },

    async setUsuarioNaoEmitenteRel(idInventario, idUsuario) {
      await api.patch(`/v1/restrito/inventario/usuario/naoemitente/${idInventario}&${idUsuario}`)
    },
  }
})
