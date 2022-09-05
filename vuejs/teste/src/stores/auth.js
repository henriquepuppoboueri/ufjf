import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

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
        const response = await api.post("login", credenciais)
        if (response) {
          localStorage.setItem("usuarioLogado", JSON.stringify(response.data))
          const responseData = await response.data
          this.usuario = responseData;
        }
      } catch (error) {
        this.erro = error
        throw new Error(error.message)
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
        useRouter().push('/login')
      }
    },

    verificarValidadeToken(dataExp) {
      return Date.now() < dataExp;
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
