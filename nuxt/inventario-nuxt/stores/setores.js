import { defineStore } from 'pinia'
import { api } from 'boot/axios'


export const useSetoresStore = defineStore({
  id: 'setores',
  state: () => ({
    setores: [],
    setoresDependencias: [],
    setor: null,
    carregando: false,
    erro: null,
    dependencia: null,
  }),
  actions: {
    buscarSetorPorId(idSetor) {
      const setor = this.setoresDependencias.find((setor) => setor.id === idSetor)
      return setor || 'Sem setor';
    },
    async addSetor(setor) {
      try {
        this.carregando = true
        const response = await api.post(`v1/restrito/setor`, setor)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async editSetor(idSetor, setor) {
      try {
        this.carregando = true
        const response = await api.put(`v1/restrito/setor/${idSetor}`, setor)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
    async delSetor(idSetor) {
      try {
        this.carregando = true
        const response = await api.delete(`v1/restrito/setor/${idSetor}`)
        return response;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false
      }
    },
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
        this.setor = await response.data
        return await response.data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    },
    async buscarSetores() {
      try {
        this.carregando = true
        const response = await api.get(`v1/restrito/setor`)
        this.setores
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
        if (response)
          this.setoresDependencias = await response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.carregando = false;

      }
    },
  }
})
