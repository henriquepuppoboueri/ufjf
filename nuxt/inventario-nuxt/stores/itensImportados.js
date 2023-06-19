export const useItensImportadosStore = defineStore('itensImportados', () => {
  const itensImportados = ref([])
  const itemImportado = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  const itensNominais = computed(() => {
    const setoresStore = useSetoresStore()
    const { buscarSetorPorId } = setoresStore

    carregando.value = true;

    if (itensImportados.value && itensImportados.value.length > 0) {
      return itensImportados.value.map(item => {
        const setor = buscarSetorPorId(item.setor)
        let dependenciaNome = 'Sem dependência'
        if (
          setor !== "Sem setor" &&
          setor.hasOwnProperty("dependencias") && (setor.dependencias.length > 0)
        ) {
          const dependencia = setor.dependencias.find((dep) => dep.id === item.dependencia)
          if (dependencia) dependenciaNome = dependencia.nome
        }
        carregando.value = false;
        return {
          ...item,
          setor: setor.nome,
          dependencia: dependenciaNome,
        };
      })
    }
  })

  async function buscarItensImportados(idInventario) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`item/itens/${idInventario}`)
      if (data)
        itensImportados.value = data
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarItemImportado(idItem) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`item/itens/${idItem}`)
      if (data)
        itemImportado.value = data
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarItemImportadoPorPatrimonio(patrimonio, idInventario) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`item/itens/${patrimonio}`)
      if (data)
        itemImportado.value = data
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  return {
    itensImportados,
    itemImportado,
    carregando,
    erro,
    itensNominais,
    buscarItensImportados,
    buscarItemImportado,
    buscarItemImportadoPorPatrimonio
  }

})
