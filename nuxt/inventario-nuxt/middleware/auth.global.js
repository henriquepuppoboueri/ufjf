export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const { carregarToken } = auth
  carregarToken()
})