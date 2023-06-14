export default defineNuxtRouteMiddleware((to, from) => {
  const routasSemToken = ['/auth/login']

  if (!routasSemToken.includes(to.fullPath)) {
    const { carregarToken } = useAuthStore()
    if (!carregarToken())
      return navigateTo('/auth/login')
  }
})