const routes = [
  {
    path: "/", redirect: { name: 'inventario' },
  },
  {
    path: "/usuario",
    // name: 'usuariosLista',
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        name: 'usuariosLista',
        component: () => import("components/usuarios/UsuarioLista.vue"),
      },
      {
        path: "novo",
        name: 'novoUsuario',
        component: () => import("components/usuarios/UsuarioCad.vue"),
      },
      {
        path: ":id",
        component: () => import("components/usuarios/UsuarioCad.vue"),
      },
    ],
  },
  {
    path: "/senha",
    // name: 'senha',
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        name: 'senha',
        component: () => import("components/usuarios/UsuarioSenha.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/LoginLayout.vue"),
    meta: { restrito: false },
    children: [
      {
        path: "logout",
        name: 'Logout',
        component: () => import("pages/auth/LogoutPage.vue"),
      },
      {
        path: "login",
        name: 'Login',
        component: () => import("pages/auth/LoginPage.vue")
      },
    ],
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
    path: "/config",
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        component: () =>
          import("pages/ConfigGeralDispositivo.vue"),
      }
    ]
  },
  {
    path: "/etiquetas",
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        component: () =>
          import("pages/ImprimirEtiqueta.vue"),
      }
    ]
  },
  {
    path: "/inventario",
    // name: 'inventario',
    component: () => import("layouts/MainLayout.vue"),
    meta: { restrito: true },
    children: [
      {
        path: "",
        name: 'inventario',
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
        // name: 'verInventario',
        component: () => import("components/inventarios/InventarioVer.vue"),
        children: [
          {
            path: '',
            name: 'verInventario',
            // component: () => import('components/inventarios/InventarioStats.vue'),
            redirect: { name: 'resumoSetores' }
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
              {
                path: 'semana',
                name: 'resumoSemana',
                component: () => import('components/inventarios/estatisticas/StatsSemana.vue'),
              },
              {
                path: 'dia',
                name: 'resumoDia',
                component: () => import('components/inventarios/estatisticas/StatsDia.vue'),
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
            path: 'itens/coletados/novo',
            name: 'itemColetadoNovo',
            component: () => import('components/inventarios/itens/item/ItemColetado.vue'),
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
          {
            path: 'relatorio',
            name: 'relatorioGeral',
            component: () => import('pages/RelatorioPage.vue'),
            children: [
              {
                path: '',
                name: 'relatorioBase',
                component: () => import('components/inventarios/relatorio/RelatorioBase.vue'),
              },
              {
                path: 'etiqueta',
                name: 'etiqueta',
                component: () => import('src/pages/ImprimirEtiqueta.vue'),
              },
            ]
          },
        ]
      },
      {
        path: "edit/:id",
        component: () => import("components/inventarios/InventarioCad.vue"),
      },
    ],
  },
  {
    path: "/print-label",
    name: "printLabel",
    meta: { restrito: false },
    component: () => import("pages/PrintLabel.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
