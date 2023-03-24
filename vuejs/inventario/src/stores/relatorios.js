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
        const response = await api.get(`v1/restrito/relatorios/semColeta/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
    async coletasSemItens(idInventario, idSetor, idDependencia) {
      idSetor = idSetor || ''
      idDependencia = idDependencia || ''
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semItem/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
    async bensSemPatrimonio(idInventario, idSetor, idDependencia) {
      idSetor = idSetor || ''
      idDependencia = idDependencia || ''
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semPatrimonio/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
    async plaquetasComProblemas(idInventario, idSetor, idDependencia) {
      idSetor = idSetor || ''
      idDependencia = idDependencia || ''
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/problemaNaPlaqueta/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
    async localDiferente(idInventario, idSetor, idDependencia) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/localDiferente/${idInventario}?idSetor=${idSetor}&idDependencia=${idDependencia}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
    async estatisticasPorDia(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/resumo/obtemResumoPorUsuario/${idInventario}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
    async estatisticasPorSemana(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/inventario/usuario/qtdecoletasemana/${idInventario}`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
        this.carregando = false
      }
    },
  }
})
