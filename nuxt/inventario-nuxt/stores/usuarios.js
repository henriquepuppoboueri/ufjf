export const useUsuariosStore = defineStore('usuarios', () => {
  const usuario = ref(null);
  const usuarios = ref([]);
  const carregando = ref(false);
  const erro = ref(null);
  const usuarioInventarios = ref([]);

  function $resetUsuario() {
    usuario.value = null;
    carregando.value = false;
    erro.value = null;
  }

  async function addUsuario(usuario) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`usuarios`, { method: 'POST', body: usuario })
      await buscarUsuarios()
      return response;
    } catch (error) {
      $resetUsuario()
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function editUsuario(idUsuario, usuario, { raw = true } = {}) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`usuarios/${idUsuario}`, { method: 'PUT', body: usuario }, { raw })
      await buscarUsuarios()
      return response;
    } catch (error) {
      $resetUsuario()
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function delUsuario(idUsuario) {
    try {
      carregando.value = true
      const response = await useCustomFetch(`usuarios/${idUsuario}`, { method: 'DELETE' })
      await buscarUsuarios()
      return response;
    } catch (error) {
      $resetUsuario()
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarUsuario(idUsuario) {
    try {
      carregando.value = true
      const data = await useCustomFetch(`usuarios/${idUsuario}`)
      if (data) {
        usuario.value = data
        return data;
      }
    } catch (error) {
      $resetUsuario()
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarUsuarios() {
    try {
      carregando.value = true
      const data = await useCustomFetch(`usuarios`)
      if (data)
        usuarios.value = data;
    } catch (error) {
      $resetUsuario()
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  async function buscarUsuarioInventarios() {
    try {
      carregando.value = true
      const data = await useCustomFetch(`usuarios/inventarios`)
      if (data) {
        usuarioInventarios.value = data
        return data
      }
    } catch (error) {
      erro.value = error
    } finally {
      carregando.value = false
    }
  }

  return {
    usuario,
    usuarios,
    carregando,
    erro,
    usuarioInventarios,
    $resetUsuario,
    addUsuario,
    editUsuario,
    delUsuario,
    buscarUsuario,
    buscarUsuarios,
    buscarUsuarioInventarios
  }
})
