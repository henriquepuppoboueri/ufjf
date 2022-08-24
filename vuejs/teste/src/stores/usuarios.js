import { defineStore } from 'pinia'
import { api } from 'boot/axios'


export const useUsuariosStore = defineStore({
  id: 'usuarios', state: () =>
  ({
    usuario: null,
    usuarios: [],
    carregando: false,
    erro: null
  })
  ,
  getters: {},
  actions: {
    async addUsuario(usuario) {
      try {
        this.carregando = true
        const response = await api.post(`v1/restrito/usuarios`, usuario)
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
        const response = await api.put(`v1/restrito/usuarios/${idUsuario}`, usuario)
        this.buscarUsuarios()
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
        const response = await api.delete(`v1/restrito/usuarios/${idUsuario}`)
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
        const response = await api.get(`v1/restrito/usuarios/${idUsuario}`)
        if (response.data)
          this.usuario = await response.data
        return response;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async buscarUsuarios() {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/usuarios`)
        if (response)
          this.usuarios = await response.data;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },

    async definirPresidente(idInventario, idUsuario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/inventario/usuario/presidente/${idInventario}&${idUsuario}`)
        if (response)
          this.usuario = await response.data;
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },
  }
})
