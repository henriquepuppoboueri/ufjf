export async function useCustomFetch(
  req, opts,
  { isRestrito = true, hasVersao = true } = {}
) {
  const config = useRuntimeConfig();
  const {
    API_BASE_URL: base,
    API_VERSAO: versao,
    API_RESTRITO: restrito,
  } = config.public;

  let baseURL = `${base}${hasVersao ? versao : ''}${isRestrito ? restrito : ''}`;

  return await $fetch(req, {
    baseURL,
    server: false,
    method: 'GET',
    ...opts,
    onRequest({ request, options }) {
      options.headers = options.headers || {}
      if (localStorage.getItem('usuarioLogado')) {
        options.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('usuarioLogado')).token}`
      }
    }
  })
}
