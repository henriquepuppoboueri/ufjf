import InventarioLista from 'components/inventarios/InventarioLista.vue';
import MainLayout from 'layouts/MainLayout.vue';
import RelatorioPage from 'pages/RelatorioPage.vue';
import RelatorioBase from 'src/components/inventarios/relatorio/RelatorioBase.vue'
import { useUsuariosStore } from 'src/stores/usuarios';

const checarAcessoInventario = async (to, from, next) => {
  const { podeAcessarInventario } = useUsuariosStore()
  if (!await podeAcessarInventario(to.params.idInventario)) {
    next({ name: 'inventario', })
  } else {
    next()
  }
}

const routes = [
  {
    path: "/", redirect: { name: 'inventario' },
  },
  {
    path: "/usuario",
    component: MainLayout,
    meta: { restrito: true },
    children: [
      {
        path: "",
        name: 'usuariosLista',
        component: () => import("pages/usuario/Index.vue"),
      },
      {
        path: "novo",
        name: 'novoUsuario',
        component: () => import("pages/usuario/Adicionar.vue"),
      },
      {
        path: ":id",
        component: () => import("pages/usuario/[id].vue"),
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
    component: MainLayout,
    meta: { restrito: true },
    children: [
      {
        path: "importar",
        component: () =>
          import("pages/ferramentas/PatImport.vue"),
      },
      {
        path: "config",
        component: () => import("pages/ferramentas/ConfigGeralDispositivo.vue"),
      },
      {
        path: "etiquetas",
        component: () => import("pages/ferramentas/ImprimirEtiqueta.vue"),
      },
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
    component: MainLayout,
    meta: { restrito: true },
    children: [
      {
        path: "",
        name: 'inventario',
        component: InventarioLista,
      },
      {
        path: "novo",
        component: () => import("components/inventarios/InventarioCad.vue"),
      },
      {
        path: "lista",
        component: InventarioLista,
      },
      {
        path: "v/:idInventario",
        // name: 'verInventario',
        component: () => import("components/inventarios/InventarioVer.vue"),
        beforeEnter: [checarAcessoInventario],
        children: [
          {
            path: '',
            name: 'verInventario',
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
            component: RelatorioPage,
            children: [
              {
                path: '',
                name: 'relatorioBase',
                component: RelatorioBase,
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
