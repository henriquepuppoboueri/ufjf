import { extractIdentifiers } from '@vue/compiler-core';
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: "/", redirect: '/inventario',
  },
  {
    path: "/usuario",
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
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
    path: "/logout",
    name: 'Logout',
    meta: { restrito: true },
    component: () => import("pages/LogoutPage.vue"),
  },
  {
    path: "/login",
    name: 'Login',
    meta: { restrito: false },
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/ferramentas",
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        component: () =>
          import("pages/PatImport.vue"),
      }
    ]
  },
  {
    path: "/inventario",
    name: 'inventario',
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
        path: "v/:idInventario",
        name: 'view',
        component: () => import("components/inventarios/InventarioVer.vue"),
        children: [
          {
            path: '',
            component: () => import('components/inventarios/InventarioStats.vue'),
          },
          {
            path: 'resumo',
            name: 'resumo',
            component: () => import('components/inventarios/estatisticas/InventarioStats.vue'),
            children: [
              {
                path: 'setores',
                name: 'resumoSetores',
                component: () => import('components/inventarios/estatisticas/StatsSetores.vue'),
              },
              {
                path: 'usuarios',
                name: 'resumoUsuarios',
                component: () => import('components/inventarios/estatisticas/StatsUsuarios.vue'),
              },
            ]
          },
          {
            path: 'unidades',
            name: 'Unidades',
            component: () => import('components/inventarios/unidades/UnidadesLista.vue'),
          },
          {
            path: 'itens',
            redirect: { name: 'itensColetados' }
          },
          {
            path: 'itens/coletados',
            name: 'itensColetados',
            component: () => import('src/components/inventarios/itens/ItensColetados.vue'),
          },
          {
            path: 'itens/coletados/:idItem',
            name: 'itemColetado',
            component: () => import('components/inventarios/itens/item/ItemColetado.vue'),
          },
          {
            path: 'itens/importados',
            name: 'itensImportados',
            component: () => import('src/components/inventarios/itens/ItensImportados.vue'),
          },
          {
            path: 'itens/importados/:idItem',
            name: 'itemImportado',
            component: () => import('components/inventarios/itens/item/ItemImportado.vue'),
          },
          {
            path: 'permissoes',
            name: 'Permissoes',
            component: () => import('components/inventarios/usuarios/UsuariosInventario.vue'),
          },
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

export default routes;
