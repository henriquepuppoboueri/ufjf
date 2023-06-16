export async function useCustomFetch(
  req, opts,
  { isRestrito = true, hasVersao = true, raw = false } = {}
) {
  const config = useRuntimeConfig();
  const {
    API_BASE_URL: base,
    API_VERSAO: versao,
    API_RESTRITO: restrito,
  } = config.public;

  let baseURL = `${base}${hasVersao ? versao : ''}${isRestrito ? restrito : ''}`;


  const fetchMode = raw ? $fetch.raw : $fetch;

  return await fetchMode(req, {
    baseURL,
    server: false,
    method: 'GET',
    ...opts,
    async onRequest({ request, options }) {
      options.headers = options.headers || {}
      if (localStorage.getItem('usuarioLogado')) {
        options.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('usuarioLogado')).token}`
      }
    },
    // onResponse({ request, response, options }) {
    //   console.log('[fetch response]', response)
    // }
  })
}
