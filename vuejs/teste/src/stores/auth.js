import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    ({
      usuario: null,
      carregando: false,
      erro: null
    })
  },
  persist: true,
  getters: {
    isUsuarioLogado: (state) => {
      return !!localStorage.getItem('usuarioLogado')
    }
  },
  actions: {
    async logar(credenciais) {
      this.carregando = true
      try {
        const response = await api.post("login", credenciais)
        if (response) {
          localStorage.setItem("usuarioLogado", JSON.stringify(response.data))
          const responseData = await response.data
          console.log(responseData);
          this.usuario = responseData;
        }
      } catch (error) {
        console.log(error);
        this.erro = error
      } finally {
        this.carregando = false
      }
    },
    carregarToken() {
      const usuarioStorage = localStorage.getItem('usuarioLogado')
      if (usuarioStorage) {
        this.usuario = JSON.parse(usuarioStorage)
      } else {
        useRouter().push('/login')
      }
    },

    async deslogar() {
      const router = useRouter()
      try {
        await api.post(`restrito/logout`)
      } catch (error) {
        throw new Error(error.message)
      } finally {
        localStorage.removeItem('usuarioLogado')
        this.usuario = null
        router.push('/login')
      }

    }
  }
})
