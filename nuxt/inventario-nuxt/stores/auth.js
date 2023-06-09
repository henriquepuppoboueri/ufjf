import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () =>
  ({
    usuario: null,
    carregando: false,
    erro: null
  })
  ,
  // persist: true,
  getters: {
    isUsuarioLogado: (state) => {
      return !!localStorage.getItem('usuarioLogado')
    }
  },
  actions: {
    async logar(credenciais) {
      this.carregando = true
      try {
        const data = await useCustomFetch('login', {
          body: credenciais,
          method: 'POST',
        }, { isRestrito: false, hasVersao: false })

        if (data) {
          localStorage.setItem("usuarioLogado", JSON.stringify(data))
          this.usuario = data
        }
      } catch (error) {
        this.erro = error
        throw error
      } finally {
        this.carregando = false
      }
    },

    carregarToken() {
      const usuarioStorage = JSON.parse(localStorage.getItem('usuarioLogado'))
      if (usuarioStorage && this.verificarValidadeToken(usuarioStorage.dataExt)) {
        this.usuario = usuarioStorage
      } else {
        localStorage.removeItem('usuarioLogado')
        this.usuario = null
        return navigateTo('/auth/login')
      }
    },

    verificarValidadeToken(dataExp) {
      return Date.now() < dataExp;
    },

    async deslogar() {
      try {
        await useCustomFetch(`logout`, { method: 'POST' }, { isRestrito: true, hasVersao: false })
        return navigateTo('/auth/login')
      } catch (error) {
        throw new Error(error.message)
      } finally {
        localStorage.removeItem('usuarioLogado')
        this.usuario = null
      }
    },

    async trocarSenha(idUsuario, login, novaSenha) {
      try {
        this.carregando = true
        const response = await api.put(`v1/restrito/usuarios/novasenhasemCPF`, { id: idUsuario, login, senha: novaSenha })
        return response
      } catch (error) {
        throw new Error(error.message)
      } finally {
        this.carregando = false
      }
    }
  }
})
