export const usePlaquetaStore = defineStore('plaqueta', () => {
  const estadosPlaquetas = ref([]);
  const estadoPlaqueta = ref(null);
  const carregando = ref(false);
  const erro = ref(null);

  async function buscarEstadosPlaquetas() {
    try {
      const data = await useCustomFetch('estadoplaqueta')
      carregando.value = true
      if (data)
        estadosPlaquetas.value = data
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarEstadoPlaqueta(idEstadoPlaqueta) {
    try {
      if (!estadosPlaquetas.value.length)
        await buscarEstadosPlaquetas()

      estadoPlaqueta.value = estadosPlaquetas.value.find(estado => estado.id === idEstadoPlaqueta) || null
    } catch (error) {
      erro.value = error
    }
  }

  return {
    estadosPlaquetas,
    estadoPlaqueta,
    carregando,
    erro,
    buscarEstadosPlaquetas,
    buscarEstadoPlaqueta
  }
})
