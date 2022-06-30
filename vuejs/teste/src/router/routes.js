
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'teste', component: () => import('pages/IndexPage.vue'), },
    ],
  },
  {
    path: '/usuario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/usuarios/UsuarioLista.vue') },
      { path: 'novo', component: () => import('src/components/usuarios/UsuarioCad.vue'), },
    ],
  },
  {
    path: '/unidade',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/unidades/UnidadeLista.vue') },
      { path: 'novo', component: () => import('src/components/unidades/UnidadeCad.vue'), },
    ],
  },
  {
    path: '/inventario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/inventarios/InventarioLista.vue') },
      { path: 'novo', component: () => import('src/components/inventarios/InventarioCad.vue'), },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
