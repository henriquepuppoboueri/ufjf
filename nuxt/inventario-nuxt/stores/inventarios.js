export const useInventariosStore = defineStore(
  'inventarios',
  () => {
    const inventarios = ref([])
    const usuariosInventario = ref([])
    const carregando = ref(false)
    const erro = ref(null)
    const inventario = ref(null)

    const presidentes = computed(() => {
      if (inventario.value && usuariosInventario.value) {
        return usuariosInventario.value.filter(usuario => usuario.presidente).map(_usuario => _usuario.nome)
      } else
        return []
    })

    async function liberarInventario(idInventario) {
      try {
        carregando.value = true
        const { status } = await useCustomFetch(`liberar/${idInventario}`, { method: 'patch' })
        await buscarInventarios();
        return status
      } catch (error) {
        this.erro.value = error
      } finally {
        carregando.value = false
      }
    }
    async function fecharInventario(idInventario) {
      try {
        const { status } = await useCustomFetch(`inventario/fechar/${idInventario}`, { method: 'patch' })
        return status
      } catch (error) {
        this.erro.value = error
      } finally {
        carregando.value = false
      }
    }

    async function addInventario(inventario) {
      const { status } = await useCustomFetch(`inventario`, { body: inventario, method: 'post' }, { raw: true })
    }

    async function delInventario(idInventario) {
      try {
        const index = this.inventarios.findIndex(inventario => inventario.id === idInventario)
        const response = await useCustomFetch(`inventario/${idInventario}`, { method: 'delete' }, { raw: true })
        if (response && response.status === 204) {
          this.inventarios.splice(index, 1)
        }
        return response
      } catch (error) {
        this.erro.value = error
      } finally {
        carregando.value = false
      }
    }

    async function editInventario(idInventario, inventario) {
      await useCustomFetch(`inventario/${idInventario}`, { method: 'put', body: inventario })
    }

    async function buscarInventario(idInventario) {
      try {
        carregando.value = true
        const data = await useCustomFetch(
          `inventario/${idInventario}`
        );
        if (data)
          inventario.value = data
      } catch (error) {
        erro.value = error
      } finally {
        carregando.value = false
      }
    }

    async function buscarInventarios(usuarioInventarios = []) {
      try {
        carregando.value = true
        const data = await useCustomFetch('inventario')
        if (data)
          inventarios.value = data
      } catch (error) {
        erro.value = error
      } finally {
        carregando.value = false
      }

      if (usuarioInventarios.length && inventarios.value) {
        inventarios.value = inventarios.value.filter(inventario => usuarioInventarios.includes(inventario.id))
      }
    }

    async function definirPresidente(idInventario, idUsuario) {
      try {
        this.carregando = true
        const { data } = await useCustomFetch(`inventario/usuario/presidente/${idInventario}&${idUsuario}`)
        if (data)
          this.usuario = data
      } catch (error) {
        this.error = error
      } finally {
        this.carregando = false
      }
    }

    async function buscarInventariosEmPreparacao() {
      const data = await useCustomFetch(`inventario_preparando`)
      if (data)
        this.inventarios = await data
    }

    async function addUsuarioInventario(idInventario, usuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/${idInventario}`, { method: 'post', body: usuario }, { raw: true })
        await this.buscarUsuariosInventario(idInventario);
        return response
      } catch (error) {
        this.erro = error
      }
    }

    async function delUsuarioInventario(idInventario, idUsuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/${idInventario}&${idUsuario}`, { method: 'delete' }, { raw: true })
        await this.buscarUsuariosInventario(idInventario);
        return response
      } catch (error) {
        this.erro = error
      }
    }

    async function buscarUsuariosInventario(idInventario) {
      const data = await useCustomFetch(
        `inventario/usuario/${idInventario}`
      );
      if (data)
        this.usuariosInventario = data;
    }

    async function setUsuarioInventarioPresidente(idInventario, idUsuario) {
      await useCustomFetch(`inventario/usuario/presidente/${idInventario}&${idUsuario}`, { method: 'patch' })
      await this.buscarUsuariosInventario(idInventario);
    }

    async function setUsuarioInventarioNormal(idInventario, idUsuario) {
      await useCustomFetch(`inventario/usuario/normal/${idInventario}&${idUsuario}`, { method: 'patch' })
      await this.buscarUsuariosInventario(idInventario);
    }

    async function setUsuarioInventarioAdmin(idInventario, idUsuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/admin/${idInventario}&${idUsuario}`, { method: 'patch' })
        await this.buscarUsuariosInventario(idInventario);
      } catch (error) {
        this.erro = error

      }
    }

    async function setUsuarioInventarioNaoAdmin(idInventario, idUsuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/naoadmin/${idInventario}&${idUsuario}`, { method: 'patch' })
        await this.buscarUsuariosInventario(idInventario);
      } catch (error) {
        this.erro = error

      }
    }

    async function setUsuarioEmitenteRel(idInventario, idUsuario) {
      try {
        await useCustomFetch(`inventario/usuario/emitente/${idInventario}&${idUsuario}`, { method: 'patch' })
      } catch (error) {
        this.erro = error
      }
    }

    async function setUsuarioNaoEmitenteRel(idInventario, idUsuario) {
      try {
        const response = await useCustomFetch(`inventario/usuario/naoemitente/${idInventario}&${idUsuario}`, { method: 'patch' })
        console.log(response);
      } catch (error) {
        this.erro = error
      }
    }

    function $initInventario() {
      this.inventario = { id: 0, nome: '', idSituacaoInventario: 1, descricao: '' }
    }

    return {
      inventario,
      inventarios,
      usuariosInventario,
      carregando,
      erro,
      presidentes,
      liberarInventario,
      fecharInventario,
      buscarInventarios,
      buscarInventariosEmPreparacao,
      addInventario,
      delInventario,
      editInventario,
      buscarInventario,
      definirPresidente,
      buscarUsuariosInventario,
      addUsuarioInventario,
      delUsuarioInventario,
      setUsuarioInventarioPresidente,
      setUsuarioInventarioNormal,
      setUsuarioInventarioAdmin,
      setUsuarioInventarioNaoAdmin,
      setUsuarioEmitenteRel,
      setUsuarioNaoEmitenteRel,
      $initInventario
    }
  }

)
