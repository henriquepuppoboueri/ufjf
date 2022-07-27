import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useSituacaoStore = defineStore({
  id: 'situacao',
  state: () => ({
    situacoes: [],
    situacao: null,
    carregando: false,
    erro: null,
  }),
  actions: {
    async buscarSituacoes() {
      try {
        this.carregando = true
        const response = await api.get('v1/restrito/situacao')
        if (response) {
          this.situacoes = await response.data
        }
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    },
    async buscarSituacao(idSituacao) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/situacao/${idSituacao}`)
        if (response) {
          this.situacao = await response.data
        }
      } catch (error) {
        this.erro = error
      } finally {
        this.carregando = false
      }
    }
  }
})
