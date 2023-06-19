// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/invint',
    head: {
      title: 'Controle de Inventário - UFJF',
    },
  },
  imports: { dirs: ['stores'] },
  modules: ['nuxt-quasar-ui', '@pinia/nuxt'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  quasar: {
    plugins: [
      'AppFullscreen',
      'BottomSheet',
      'Dialog',
      'Loading',
      'LoadingBar',
      'Notify',
    ],
    extras: {
      font: 'roboto-font',
      fontIcons: ['material-icons', 'fontawesome-v6'],
      animations: 'all',
    },
    config: {
      dark: false,
    },
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      API_VERSAO: process.env.API_VERSAO,
      API_RESTRITO: process.env.API_RESTRITO,
    },
  },
  ssr: false,
});
