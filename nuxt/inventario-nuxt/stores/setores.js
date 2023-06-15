export const useSetoresStore = defineStore('setores', () => {
  const setores = ref([]);
  const setoresDependencias = ref([]);
  const setor = ref(null);
  const setorDependencias = ref([]);
  const carregando = ref(false);
  const erro = ref(null);
  const dependencia = ref(null);

  function buscarSetorPorId(idSetor) {
    const setor = setores.value.find((setor) => setor.id === idSetor)
    return setor || 'Sem setor';
  }

  async function addSetor(setor) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`setor`, { body: setor, method: 'post' })
      return response;
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  async function editSetor(idSetor, setor) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`setor/${idSetor}`, { body: setor, method: 'put' })
      return response;
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  async function delSetor(idSetor) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`setor/${idSetor}`, { method: 'delete' })
      return response;
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  async function buscarDepsDoSetor(idSetor) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`setor/dependencia/${idSetor}`)
      setorDependencias.value = data || [];
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  async function buscarSetor(idSetor) {
    try {
      carregando.value = true
      const { data } = await useCustomFetch(`setor/${idSetor}`)
      setor.value = data || null
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  async function buscarSetores() {
    try {
      carregando.value = true
      const { data } = await useCustomFetch(`setor`)
      setores.value = data || [];
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  async function buscarSetoresDependencias(idInventario) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`inventario/setor/dependencia/${idInventario}`)
      setoresDependencias.value = data || [];
    } catch (error) {
      erro.value = error;
    } finally {
      carregando.value = false
    }
  }

  function $resetSetores() {
    setor.value = null;
    setorDependencias.value = [];
    dependencia.value = null;
  }

  return {
    setores,
    setoresDependencias,
    setorDependencias,
    setor,
    carregando,
    erro,
    dependencia,
    buscarSetorPorId,
    addSetor,
    editSetor,
    delSetor,
    buscarDepsDoSetor,
    buscarSetor,
    buscarSetores,
    buscarSetoresDependencias,
    $resetSetores
  }
})
