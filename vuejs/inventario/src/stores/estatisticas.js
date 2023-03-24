import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useEstatisticasStore = defineStore({
  id: 'estatisticas',
  state: () => ({
    dados: null,
    carregando: false,
    erro: null,
    ultimaBusca: null,
  }),
  actions: {
    async buscarTotaisSetores(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/resumo/obtemResumoPorSetor/${idInventario}`)
        const data = await response.data
        this.dados = await data
        this.carregando = false
        this.ultimaBusca = { recalcular: this.recalcularTotaisSetores.bind(this, idInventario) }
      } catch (error) {
        this.erro = error
      }
    },
    async recalcularTotaisSetores(idInventario) {
      try {
        this.carregando = true
        await api.get(`v1/restrito/resumo/geraResumoPorSetor/${idInventario}`)
        await this.buscarTotaisSetores(idInventario);
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
        this.ultimaBusca = { recalcular: this.recalcularResumoSemana.bind(this, idInventario) }
      } catch (error) {
        this.erro = error
      }
    },
    async recalcularResumoSemana(idInventario) {
      try {
        this.carregando = true
        await api.get(`v1/restrito/resumo/geraResumoPorSemana/${idInventario}`)
        await this.buscarResumoSemana(idInventario);
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
        this.ultimaBusca = { recalcular: this.recalcularResumoUsuarios.bind(this, idInventario) }
      } catch (error) {
        this.erro = error
      }
    },
    async recalcularResumoUsuarios(idInventario) {
      try {
        this.carregando = true
        await api.get(`v1/restrito/resumo/geraResumoPorUsuario/${idInventario}`)
        await this.buscarResumoUsuarios(idInventario);
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
        this.ultimaBusca = { recalcular: this.recalcularResumoDia.bind(this, idInventario) }
      } catch (error) {
        this.erro = error
      }
    },
    async recalcularResumoDia(idInventario) {
      try {
        this.carregando = true
        await api.get(`v1/restrito/resumo/geraResumoPorDia/${idInventario}`)
        await this.buscarResumoDia(idInventario);
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },


  }
})
