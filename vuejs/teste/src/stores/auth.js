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
        const response = await api.post("login", credenciais)
        sessionStorage.setItem("usuarioLogado", JSON.stringify(response.data))
        this.usuario = response.data
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },
    carregarToken() {
      const usuarioSession = sessionStorage.getItem('usuarioLogado')
      if (usuarioSession) {
        this.usuario = JSON.parse(usuarioSession)
      } else {
        useRouter().push('/login')
      }
    },

    async deslogar() {
      const router = useRouter()
      try {
        await api.post(`restrito/logout`)
        sessionStorage.removeItem('usuarioLogado')
        this.usuario = null
      } catch (error) {
        throw new Error(error.message)
      } finally {
        router.push('/login')
      }

    }
  }
})
