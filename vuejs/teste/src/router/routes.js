import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: "/", redirect: '/inventario',
    // component: () => import("layouts/MainLayout.vue"),
    // children: [
    //   { path: "", component: () => import("pages/IndexPage.vue") },
    // ],
  },
  {
    path: "/usuario",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/usuarios/UsuarioLista.vue"),
      },
      {
        path: "novo",
        component: () => import("components/usuarios/UsuarioCad.vue"),
      },
      {
        path: ":id",
        component: () => import("components/usuarios/UsuarioCad.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: 'Login',
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/inventario",
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        component: () =>
          import("components/inventarios/InventarioLista.vue"),
      },
      {
        path: "novo",
        component: () => import("components/inventarios/InventarioCad.vue"),
      },
      {
        path: "lista",
        component: () =>
          import("components/inventarios/InventarioLista.vue"),
      },
      {
        path: "view/:idInventario",
        name: 'view',
        component: () => import("components/inventarios/InventarioVer.vue"),
        children: [
          {
            path: '',
            component: () => import('components/inventarios/InventarioStats.vue'),
          },
          {
            path: 'resumo',
            component: () => import('components/inventarios/InventarioStats.vue'),
          },
          {
            path: 'unidades',
            name: 'unidades',
            component: () => import('components/inventarios/unidades/UnidadesLista.vue'),
          },
          {
            path: 'items',
            name: 'items',
            component: () => import('components/inventarios/items/ItemsColetados.vue'),
          },
          {
            path: 'items/item/:idItem',
            component: () => import('components/inventarios/items/item/ItemCad.vue'),
          }
          //   children: [{
          //     path: '',
          //     component: () => import('components/inventarios/items/item/ItemCad.vue'),
          //   },
          //   {
          //     path: 'item/:idItem',
          //     component: () => import('components/inventarios/items/item/ItemCad.vue'),
          //   }]
        ]
      },
      {
        path: "edit/:id",
        component: () => import("components/inventarios/InventarioCad.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  console.log('beforeEach');;
})

export default routes;
