import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useRelatoriosStore = defineStore({
  id: 'relatorios',
  state: () => ({
    relatorio: null,
    carregando: false,
    erro: null
  }),
  actions: {
    async bensNaoEncontrados(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/relatorios/semInventario/${idInventario}&idSetor=&idDepartamento`)
        const data = await response.data
        this.relatorio = await data
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    }
  }
})
