import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useEstatisticasStore = defineStore({
  id: 'estatisticas',
  state: () => ({
    dados: null,
    carregando: false,
    erro: null
  }),
  actions: {
    async buscarTotaisSetores(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/item/qtde/${idInventario}`)
        const data = await response.data
        this.dados = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
  }
})
