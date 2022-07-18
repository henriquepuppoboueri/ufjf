import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api_options = { baseURL: 'http://10.1.2.90:9001' }
const api = axios.create(api_options)

const usuarioLogado = sessionStorage.getItem('usuarioLogado') || false;
if (usuarioLogado) {
  const usuarioJSON = JSON.parse(usuarioLogado);
  api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${usuarioJSON.token}`
    return config
  })
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
