const routes = [
  {
    path: "/", redirect: '/inventario',
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
    ],
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
    path: "/setor",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/components/setores/SetorLista.vue"),
      },
      {
        path: "novo",
        component: () => import("src/components/setores/SetorCad.vue"),
      },
    ],
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
        path: "items",
        component: () =>
          import("src/components/inventarios/items/ItemsLista.vue"),
      },
      {
        path: "coletados",
        component: () =>
          import("src/components/inventarios/items/ItemsColetados.vue"),
      },
      {
        path: "view/:id",
        component: () => import("src/components/inventarios/InventarioVer.vue"),
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
