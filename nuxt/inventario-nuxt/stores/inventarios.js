export const useInventariosStore = defineStore({
  id: 'inventarios',
  state: () => ({
    inventarios: [],
    usuariosInventario: [],
    carregando: false,
    erro: null,
    inventario: null
  }),
  // persist: true,
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
      const { status } = await useCustomFetch(`inventario`, { body: inventario, method: 'post' }, { raw: true })
    },

    async delInventario(idInventario) {
      try {
        const index = this.inventarios.findIndex(inventario => inventario.id === idInventario)
        const response = await useCustomFetch(`inventario/${idInventario}`, { method: 'delete' }, { raw: true })
        if (response && response.status === 204) {
          this.inventarios.splice(index, 1)
        }
        return response
      } catch (error) {
        this.erro = error
        throw new Error(error.data)
      }
    },

    async editInventario(idInventario, inventario) {
      await useCustomFetch(`inventario/${idInventario}`, { method: 'put', body: inventario })
    },

    async buscarInventario(idInventario) {
      const data = await useCustomFetch(
        `inventario/${idInventario}`
      );
      if (data)
        this.inventario = data
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
        const { data } = await useCustomFetch(`inventario/usuario/presidente/${idInventario}&${idUsuario}`)
        if (data)
          this.usuario = data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async buscarInventariosEmPreparacao() {
      const data = await useCustomFetch(`inventario_preparando`)
      if (data)
        this.inventarios = await data
    },

    async addUsuarioInventario(idInventario, usuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/${idInventario}`, { method: 'post', body: usuario }, { raw: true })
        await this.buscarUsuariosInventario(idInventario);
        return response
      } catch (error) {
        this.erro = error
      }
    },

    async delUsuarioInventario(idInventario, idUsuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/${idInventario}&${idUsuario}`, { method: 'delete' }, { raw: true })
        await this.buscarUsuariosInventario(idInventario);
        return response
      } catch (error) {
        this.erro = error
      }
    },

    async buscarUsuariosInventario(idInventario) {
      const data = await useCustomFetch(
        `inventario/usuario/${idInventario}`
      );
      if (data)
        this.usuariosInventario = data;
    },

    async setUsuarioInventarioPresidente(idInventario, idUsuario) {
      await useCustomFetch(`inventario/usuario/presidente/${idInventario}&${idUsuario}`, { method: 'patch' })
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioNormal(idInventario, idUsuario) {
      await useCustomFetch(`inventario/usuario/normal/${idInventario}&${idUsuario}`, { method: 'patch' })
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioAdmin(idInventario, idUsuario) {
      const response = await useCustomFetch(`inventario/usuario/admin/${idInventario}&${idUsuario}`, { method: 'patch' })
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioInventarioNaoAdmin(idInventario, idUsuario) {
      const response = await useCustomFetch(`inventario/usuario/naoadmin/${idInventario}&${idUsuario}`, { method: 'patch' })
      await this.buscarUsuariosInventario(idInventario);
    },

    async setUsuarioEmitenteRel(idInventario, idUsuario) {
      await useCustomFetch(`inventario/usuario/emitente/${idInventario}&${idUsuario}`, { method: 'patch' })
    },

    async setUsuarioNaoEmitenteRel(idInventario, idUsuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/naoemitente/${idInventario}&${idUsuario}`, { method: 'patch' })
        console.log(response);
      } catch (error) {
        this.erro = error
      }
    },

    $initInventario() {
      this.inventario = { id: 0, nome: '', idSituacaoInventario: 1, descricao: '' }
    }
  }
})
