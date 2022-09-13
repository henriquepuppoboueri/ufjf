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
    async bensNaoEncontrados(idInventario, idSetor, idDependencia) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semColeta/${idInventario}&idSetor=${idSetor}&idDependencia=${idDependencia}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
    async coletasSemItens(idInventario, idSetor, idDependencia) {
      try {
        idSetor = idSetor || ''
        idDependencia = idDependencia || ''
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semItem/${idInventario}&idSetor=${idSetor}&idDepartamento=${idDependencia}`)
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
    async localDiferente(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/localDiferente/${idInventario}&idSetor=&idDepartamento`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },
  }
})
