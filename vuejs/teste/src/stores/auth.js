import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    return { usuario: null, carregando: false, erro: null }
  },
  persist: true,
  getters: {
    isUsuarioLogado: (state) => {
      return !!state.usuario;
    }
  },
  actions: {
    async logar(credenciais) {
      this.carregando = true
      try {
        await api.post("login", credenciais).then((res) => {
          sessionStorage.setItem("usuarioLogado", JSON.stringify(res.data))
          this.usuario = res.data
        })
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },
    carregarToken() {
      console.log('CarregarToken');
      const usuarioSession = sessionStorage.getItem('usuarioLogado')
      if (usuarioSession) {
        this.usuario = usuarioSession
      } else {
        useRouter().push('/login')
      }
    }
  }
})
