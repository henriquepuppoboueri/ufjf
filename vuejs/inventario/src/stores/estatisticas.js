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
  getters: {
    usuariosComColeta: (state) => {
      return (dataSource) => {
        const usuComColeta = dataSource.coleta.map((usuColeta) => {
          return {
            idUsuario: usuColeta.usuario.id,
            totais: usuColeta.coleta.map(coletaSemana => coletaSemana.qtde).reduce((a, b) => a + b)
          }
        }).filter(usuColeta => usuColeta.totais > 0).map(usuario => usuario.idUsuario)
        return { ...dataSource, coleta: dataSource.coleta.filter(usuColeta => usuComColeta.includes(usuColeta.usuario.id)) }

      }
    },
    diasComColeta: (state) => {
      const totaisDiarios = {}
      const diasComColeta = []

      state.dados.coleta.forEach((usuarioColetaDiaria) => {
        usuarioColetaDiaria.coleta.forEach(coletaDia => {
          totaisDiarios[coletaDia.data] = coletaDia.qtde + (totaisDiarios[coletaDia.data] || 0)
        })
      })
      for (const key in totaisDiarios) {
        if (totaisDiarios[key] > 0)
          diasComColeta.push(key)
      }
      const response = {
        ...state.dados, coleta: state.dados.coleta.map(usuColeta => {
          return {
            usuario: usuColeta.usuario,
            coleta: usuColeta.coleta.filter(coletaDia => {
              return diasComColeta.includes(coletaDia.data)
            })
          }
        })
      }
      return response
    },
    usuariosComColetaDia: (state) => {
      return state.usuariosComColeta(state.diasComColeta)
    },
    usuariosComColetaSemana: (state) => {
      return state.usuariosComColeta(state.dados)
    }
  },
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
    async buscarResumoSemana(idInventario, esconderSemColeta = false) {
      try {

        this.carregando = true
        const { data } = await api.get(`v1/restrito/resumo/obtemResumoPorSemana/${idInventario}`)
        this.dados = await data
        if (esconderSemColeta) {
          this.dados = this.usuariosComColetaSemana
          console.log(this);
        } else
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
        const { data } = await api.get(`v1/restrito/resumo/obtemResumoPorUsuario/${idInventario}`)
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
        console.log('recalcularResumoUsuarios');
        await this.buscarResumoUsuarios(idInventario);
        this.carregando = false
      } catch (error) {
        this.erro = error
      }
    },

    async buscarResumoDia(idInventario) {
      try {
        this.carregando = true
        const { data } = await api.get(`v1/restrito/resumo/obtemResumoPorDia/${idInventario}`)
        this.dados = await data
        this.ultimaBusca = { recalcular: this.recalcularResumoDia.bind(this, idInventario) }
        this.carregando = false
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
