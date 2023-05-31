import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'
import { api } from 'boot/axios'
import { storeToRefs } from 'pinia'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    // console.log(from.query.redirect, '=>', to.query.redirect)

    if (to.meta.restrito) {
      const authStore = useAuthStore();
      const { isUsuarioLogado } = storeToRefs(authStore)
      if (!isUsuarioLogado.value) {
        next({ name: 'Login', replace: true, })
      }
      api.interceptors.request.use(config => {
        const usuarioLogado = localStorage.getItem('usuarioLogado')
        if (usuarioLogado) {
          const json = JSON.parse(usuarioLogado)
          config.headers.Authorization = `Bearer ${json.token}`
        }
        return config
      })
      sessionStorage.setItem('lastUrl', JSON.stringify({ path: to.path, query: to.query }))
    }
    next()
  })
  return Router
})
