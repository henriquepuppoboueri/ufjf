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
        component: () => import("src/components/usuarios/UsuarioLista.vue"),
      },
      {
        path: "novo",
        component: () => import("src/components/usuarios/UsuarioCad.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/inventario",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("src/components/inventarios/InventarioLista.vue"),
      },
      {
        path: "novo",
        component: () => import("src/components/inventarios/InventarioCad.vue"),
      },
      {
        path: "lista",
        component: () =>
          import("src/components/inventarios/InventarioLista.vue"),
      },
      {
        path: "view/:idInventario",
        name: 'view',
        component: () => import("src/components/inventarios/InventarioVer.vue"),
        children: [
          {
            path: '',
            component: () => import('src/components/inventarios/InventarioStats.vue'),
          },
          {
            path: 'resumo',
            component: () => import('src/components/inventarios/InventarioStats.vue'),
          },
          {
            path: 'unidades',
            name: 'unidades',
            component: () => import('src/components/inventarios/unidades/UnidadesLista.vue'),
          },
          {
            path: 'items',
            name: 'items',
            component: () => import('src/components/inventarios/items/ItemsColetados.vue'),
          },
          {
            path: 'items/item/:idItem',
            component: () => import('src/components/inventarios/items/item/ItemCad.vue'),
          }
          //   children: [{
          //     path: '',
          //     component: () => import('src/components/inventarios/items/item/ItemCad.vue'),
          //   },
          //   {
          //     path: 'item/:idItem',
          //     component: () => import('src/components/inventarios/items/item/ItemCad.vue'),
          //   }]
        ]
      },
      {
        path: "edit/:id",
        component: () => import("src/components/inventarios/InventarioCad.vue"),
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

export default routes;
