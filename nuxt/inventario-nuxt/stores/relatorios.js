export const useRelatoriosStore = defineStore('relatorios', () => {
  const relatorio = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  function sanitizeUrl(url, params = {}) {
    const regex = /\${(.*?)}/g
    const sanitizedUrl = url.replace(regex, (match, pl) => {
      return params[pl.trim()] || ''
    }
    )
    return sanitizedUrl
  }

  async function buscarDadosRelatorio({ nome = '', params = {} }) {
    try {
      carregando.value = true
      const url = relatoriosLista.find(rel => rel.nome === nome)?.url || ''
      // não existe relatório ou url não informada
      if (!url) return
      const sanitizedUrl = sanitizeUrl(url, params)
      const data = await useCustomFetch(sanitizedUrl)
      relatorio.value = data || []
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  function $resetRelatorio() {
    relatorio.value = null
  }

  return {
    relatorio,
    carregando,
    erro,
    buscarDadosRelatorio,
    $resetRelatorio
  }

})
