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
