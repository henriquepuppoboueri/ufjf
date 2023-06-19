export const useDependenciasStore = defineStore('dependencias', () => {
  const dependencias = ref([])
  const dependencia = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  async function addDependencia(dependencia) {
    try {
      carregando.value = true
      const response = await useCustomFetch('dependencia', { method: 'post', body: dependencia })
      return response
    } catch (error) {
      this.erro = error
    } finally {
      carregando.value = false
    }
  }

  async function editDependencia(idDependencia, dependencia) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`dependencia/${idDependencia}`, { method: 'put', body: dependencia })
      return response
    } catch (error) {
      this.erro = error
    } finally {
      carregando.value = false
    }
  }

  async function delDependencia(idDependencia) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`dependencia/${idDependencia}`, { method: 'delete' })
      return response
    } catch (error) {
      this.erro = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarDependencia(idDependencia) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`dependencia/${idDependencia}`)
      if (data)
        dependencia.value = data
      return data
    } catch (error) {
      this.erro = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarDependencias(idSetor) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`setor/dependencia/${idSetor}`)
      if (data)
        dependencias.value = data
      return data
    } catch (error) {
      this.erro = error
    } finally {
      carregando.value = false
    }
  }

  return {
    dependencias,
    dependencia,
    carregando,
    erro,
    addDependencia,
    editDependencia,
    delDependencia,
    buscarDependencia,
    buscarDependencias
  }
})