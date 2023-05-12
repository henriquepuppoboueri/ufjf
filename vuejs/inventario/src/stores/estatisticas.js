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
      console.log(response);
      return response
    },
    usuariosComColeta: (state) => {
      const usuariosComColeta = state.dados.coleta.map((usuColeta) => {
        return {
          idUsuario: usuColeta.usuario.id,
          totais: usuColeta.coleta.map(coletaSemana => coletaSemana.qtde).reduce((a, b) => a + b)
        }
      }).filter(usuColeta => usuColeta.totais > 0).map(usuario => usuario.idUsuario)

      return { ...state.dados, coleta: state.dados.coleta.filter(usuColeta => usuariosComColeta.includes(usuColeta.usuario.id)) }
    },
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
        if (esconderSemColeta) {

          const usuariosComColeta = await data.coleta.map((usuColeta) => {
            return {
              idUsuario: usuColeta.usuario.id,
              totais: usuColeta.coleta.map(coletaSemana => coletaSemana.qtde).reduce((a, b) => a + b)
            };
          }).filter(usuColeta => usuColeta.totais > 0).map(usuario => usuario.idUsuario)

          this.dados = await { ...data, coleta: data.coleta.filter(usuColeta => usuariosComColeta.includes(usuColeta.usuario.id)) }
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
        const { data } = await api.get(`v1/restrito/resumo/obtemResumoPorDia/${idInventario}`)
        this.dados = await data
        this.carregando = false
        this.ultimaBusca = { recalcular: this.recalcularResumoSemana.bind(this, idInventario) }
      } catch (error) {
        this.erro = error
      }
      // try {
      //   this.carregando = true
      //   const response = await api.get(`v1/restrito/resumo/obtemResumoPorDia/${idInventario}`)
      //   const data = await response.data
      //   this.dados = await data
      //   this.carregando = false
      //   this.ultimaBusca = { recalcular: this.recalcularResumoDia.bind(this, idInventario) }
      // } catch (error) {
      //   this.erro = error
      // }
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
