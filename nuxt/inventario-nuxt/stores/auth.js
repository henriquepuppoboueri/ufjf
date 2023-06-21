export const useAuthStore = defineStore('auth', () => {

  const usuario = ref(null);
  const carregando = ref(false);
  const erro = ref(null);

  const isUsuarioLogado = computed(() => {
    return !!localStorage.getItem('usuarioLogado')
  })

  async function logar(credenciais) {
    carregando.value = true;
    try {
      const data = await useCustomFetch('login', {
        body: credenciais,
        method: 'POST',
      }, { isRestrito: false, hasVersao: false })

      if (data) {
        localStorage.setItem("usuarioLogado", JSON.stringify(data))
        usuario.value = data
      }
    } catch (error) {
      erro.value = error
      throw error
    } finally {
      carregando.value = false
    }
  }

  function carregarToken() {
    const usuarioStorage = JSON.parse(localStorage.getItem('usuarioLogado'))
    if (usuarioStorage && verificarValidadeToken(usuarioStorage.dataExt)) {
      usuario.value = usuarioStorage
    } else {
      localStorage.removeItem('usuarioLogado')
      usuario.value = null
    }
    return !!usuario.value
  }

  function verificarValidadeToken(dataExp) {
    return Date.now() < dataExp;
  }

  async function deslogar() {
    try {
      await useCustomFetch(`logout`, { method: 'POST' }, { hasVersao: false })
      return navigateTo('/auth/login')
    } catch (error) {
      throw new Error(error.message)
    } finally {
      localStorage.removeItem('usuarioLogado')
      usuario.value = null
    }
  }

  async function trocarSenha(idUsuario, login, novaSenha) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`usuarios/novasenhasemCPF`, { body: { id: idUsuario, login, senha: novaSenha }, method: 'put' })
      return response
    } catch (error) {
      throw new Error(error.message)
    } finally {
      carregando.value = false
    }
  }

  return {
    usuario,
    carregando,
    erro,
    isUsuarioLogado,
    logar,
    carregarToken,
    verificarValidadeToken,
    deslogar,
    trocarSenha
  }
})