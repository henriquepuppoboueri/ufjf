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
        const response = await api.get(`v1/restrito/resumo/obtemResumoPorSetor/${idInventario}`)
        const data = await response.data
        this.dados = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async buscarResumoSemana(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/resumo/obtemResumoPorSemana/${idInventario}`)
        const data = await response.data
        this.dados = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async buscarResumoUsuarios(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/resumo/obtemResumoPorUsuario/${idInventario}`)
        const data = await response.data
        this.dados = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async buscarResumoDia(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/resumo/obtemResumoPorDia/${idInventario}`)
        const data = await response.data
        this.dados = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
  }
})
