import { defineStore } from 'pinia'
import { api } from 'boot/axios'


export const useUsuariosStore = defineStore({
  id: 'usuarios', state: () => {
    return {
      usuarios: [],
      carregando: false,
      erro: null
    }
  },
  getters: {},
  actions: {
    async addUsuario(usuario) {
      try {
        this.carregando = true
        const response = await api.post(`v1/restrito/usuarios`, usuario)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async editUsuario(idUsuario, usuario) {
      try {
        this.carregando = true
        const response = await api.put(`v1/restrito/usuarios/${idUsuario}`, usuario)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarUsuario(idUsuario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/usuarios/${idUsuario}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },

    async buscarUsuarios() {
      try {
        this.carregando = true
        await api.get(`v1/restrito/usuarios`).then(async (usuariosResponse) => {
          this.usuarios = usuariosResponse.data;
        });
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    }
  }
})
