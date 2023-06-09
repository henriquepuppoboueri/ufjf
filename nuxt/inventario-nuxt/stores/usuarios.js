import { defineStore } from 'pinia'


export const useUsuariosStore = defineStore({
  id: 'usuarios', state: () =>
  ({
    usuario: null,
    usuarios: [],
    carregando: false,
    erro: null,
    usuarioInventarios: [],
  })
  ,
  getters: {

  },

  actions: {
    async addUsuario(usuario) {
      try {
        this.carregando = true
        const response = await useCustomFetch(`usuarios`, { method: 'POST', body: usuario })
        this.buscarUsuarios()
        return response;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async editUsuario(idUsuario, usuario) {
      try {
        this.carregando = true
        const response = await useCustomFetch(`usuarios/${idUsuario}`, { method: 'PUT', body: usuario })
        await this.buscarUsuarios()
        return response;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async delUsuario(idUsuario) {
      try {
        this.carregando = true
        const response = await useCustomFetch(`usuarios/${idUsuario}`, { method: 'DELETE' })
        this.buscarUsuarios()
        return response;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async buscarUsuario(idUsuario) {
      try {
        this.carregando = true
        const data = await useCustomFetch(`usuarios/${idUsuario}`)
        if (data) {
          this.usuario = await data
          return data;
        }
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },
    async buscarUsuarios() {
      try {
        this.carregando = true
        const data = await useCustomFetch(`usuarios`)
        if (data)
          this.usuarios = await data;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },
    async buscarUsuarioInventarios() {
      try {
        this.carregando = true
        const data = await useCustomFetch(`usuarios/inventarios`)
        if (data) {
          this.usuarioInventarios = await data
          return data
        }
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },
    async podeAcessarInventario(idInventario) {
      await this.buscarUsuarioInventarios()
      return this.usuarioInventarios.map(inventario => inventario.idInventario).includes(+idInventario)
    }
  }
})
