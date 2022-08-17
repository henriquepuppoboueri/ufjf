import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useRelatoriosStore = defineStore({
  id: 'relatorios',
  state: () => ({
    relatorio: [],
    carregando: false,
    erro: null
  }),
  actions: {
    async bensNaoEncontrados(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semColeta/${idInventario}&idSetor=&idDepartamento`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async coletasSemItens(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semItem/${idInventario}&idSetor=&idDepartamento`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async bensSemPatrimonio(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semPatrimonio/${idInventario}&idSetor=&idDepartamento`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async plaquetasComProblemas(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/problemaNaPlaqueta/${idInventario}&idSetor=&idDepartamento`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
  }
})
