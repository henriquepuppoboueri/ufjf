import { defineStore } from 'pinia'
import { api } from 'boot/axios'


export const useDependenciasStore = defineStore({
  id: 'dependencias',
  state: () => ({
    dependencias: [],
    dependencia: null,
    carregando: false,
    erro: null
  }),
  actions: {
    async addDependencia(dependencia) {
      try {
        this.carregando = true
        const response = await api.post(`v1/restrito/dependencia`, dependencia)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async editDependencia(idDependencia, dependencia) {
      try {
        this.carregando = true
        const response = await api.put(`v1/restrito/dependencia/${idDependencia}`, dependencia)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async delDependencia(idDependencia) {
      try {
        this.carregando = true
        const response = await api.delete(`v1/restrito/dependencia/${idDependencia}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async buscarDependencia(idDependencia) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/dependencia/${idDependencia}`)
        this.dependencia = await response.data;
        return await response.data
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async buscarDependencias(idSetor) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/setor/dependencia/${idSetor}`)
        this.dependencias = await response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
  }
})
