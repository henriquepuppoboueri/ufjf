import { defineStore } from 'pinia'
import { api } from 'boot/axios'


export const useDependenciasStore = defineStore({
  id: 'dependencias',
  state: () => ({
    unidades: [],
    unidade: null,
    carregando: false,
    erro: null
  }),
  actions: {
    async buscarDepsDoSetor(idSetor) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/setor/dependencia/${idSetor}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async buscarSetor(idSetor) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/setor/${idSetor}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async buscarSetoresDependencias(idInventario) {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/inventario/setor/dependencia/${idInventario}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
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
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
  }
})
