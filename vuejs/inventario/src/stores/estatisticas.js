import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useEstatisticasStore = defineStore({
  id: 'estatisticas',
  state: () => ({
    dados: null,
    carregando: false,
    erro: null,
    opcoesFiltro: {
      periodo: 'dia' || 'semana',
      somenteComColetas: true,
      acumular: true,
    },
    ultimaBusca: null,
  }),
  getters: {
    listaDiasComColeta: (state) => {
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
      return diasComColeta
    },
    listaSemanasComColeta: (state) => {
      const totaisSemanais = {}
      const semanasComColeta = []

      state.dados.coleta.forEach((usuarioColeta) => {
        usuarioColeta.coleta.forEach(coletaSemana => {
          const data = `${coletaSemana.semana}-${coletaSemana.ano}`
          totaisSemanais[data] = coletaSemana.qtde + (totaisSemanais[data] || 0)
        })
      })
      for (const key in totaisSemanais) {
        if (totaisSemanais[key] > 0)
          semanasComColeta.push(key)
      }
      return semanasComColeta
    },
    listaUsuariosComColeta: (state) => {
      return state.dados.coleta.map((usuColeta) => {
        return ({
          idUsuario: usuColeta.usuario.id,
          totais: usuColeta.coleta.map(coletaSemana => {
            return coletaSemana.qtde
          }).reduce((a, b) => {
            return a + b
          })
        })
      }).filter(usuColeta => {
        return usuColeta.totais > 0
      }).map(usuario => {
        return usuario.idUsuario
      })
    },
    // usuariosComColetaPorPeriodo: (state) => (dataSource) => {
    //   return {
    //     ...dataSource, coleta: dataSource.coleta.filter(usuColeta => {
    //       return usuComColeta.includes(usuColeta.usuario.id)
    //     })
    //   }
    // },
    // coletasSemanaisAcumuladas(state) {
    //   return state.dados.coleta.map(usuarioColeta => ({
    //     ...usuarioColeta,
    //     coleta: usuarioColeta.coleta.map((coletaMes, index) => {
    //       return {
    //         ...coletaMes,
    //         qtde: usuarioColeta.coleta.slice(0, ++index).map(coleta => coleta.qtde).reduce((pv, cv) => {
    //           return pv + cv
    //         }),
    //       }
    //     })
    //   }))
    // },
    // somenteColetasSemanaisAcumuladas(state) {
    //   console.log(this.coletasSemanaisAcumuladas);
    //   return this.coletasSemanaisAcumuladas;
    // },
    somenteSemanasUsuariosComColeta: (state) => {
      const filtered = state.dados.coleta.filter(usuarioColeta => {
        return state.listaUsuariosComColeta.includes(usuarioColeta.usuario.id)
      }).map(usuarioColeta => {
        return {
          ...usuarioColeta,
          coleta: usuarioColeta.coleta.filter(_coleta => {
            const data = `${_coleta.semana}-${_coleta.ano}`
            return state.listaSemanasComColeta.includes(data)
          })
        }
      })
      return { coleta: filtered }
    },
    somenteSemanasUsuariosComColetasAcumuladas: (state) => {
      const filtered = state.somenteSemanasUsuariosComColeta.coleta.map(usuarioColeta => ({
        ...usuarioColeta,
        coleta: usuarioColeta.coleta.map((coletaMes, index) => {
          return {
            ...coletaMes,
            qtde: usuarioColeta.coleta.slice(0, ++index).map(coleta => coleta.qtde).reduce((pv, cv) => {
              return pv + cv
            }),
          }
        })
      }))
      return { coleta: filtered }
    },
    somenteDiasUsuariosComColeta: (state) => {
      return {
        coleta: state.dados.coleta.filter(usuarioColeta => {
          return state.listaUsuariosComColeta.includes(usuarioColeta.usuario.id)
        }).map(usuarioColeta => {
          return {
            ...usuarioColeta,
            coleta: usuarioColeta.coleta.filter(_coleta => {
              return state.listaDiasComColeta.includes(_coleta.data)
            })
          }
        })
      }
    },
    // usuariosComColetaDia: (state) => {
    //   return state.usuariosComColetaPorPeriodo(state.diasComColeta)
    // },
    // usuariosComColetaSemana: (state) => {
    //   return state.usuariosComColetaPorPeriodo(state.dados)
    // }
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
    async buscarResumoSemana(idInventario) {
      try {

        this.carregando = true
        const { data } = await api.get(`v1/restrito/resumo/obtemResumoPorSemana/${idInventario}`)
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
