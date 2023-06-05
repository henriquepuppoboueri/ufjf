import MainLayout from 'layouts/MainLayout.vue';
import InventarioLista from 'components/inventarios/InventarioLista.vue';
import RelatorioBase from 'src/components/inventarios/relatorio/RelatorioBase.vue'
import LoginPage from 'pages/auth/LoginPage.vue';
import { useUsuariosStore } from 'src/stores/usuarios';

const checarAcessoInventario = async (to, from, next) => {
  const { podeAcessarInventario } = useUsuariosStore()
  if (!await podeAcessarInventario(to.params.idInventario)) {
    next({ name: 'inventarioIndex', })
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
        component: () => import("pages/usuario/index.vue"),
      },
      {
        path: "novo",
        name: 'novoUsuario',
        component: () => import("pages/usuario/adicionar.vue"),
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
        component: LoginPage
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
          import("src/pages/ferramentas/PatImport.vue"),
      },
      {
        path: "config",
        component: () => import("src/pages/ferramentas/ConfigGeralDispositivo.vue"),
      },
      {
        path: "etiquetas",
        component: () => import("src/pages/ferramentas/ImprimirEtiqueta.vue"),
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
        name: 'inventarioIndex',
        component: () => import('src/pages/inventario/index.vue'),
      },
      {
        path: "novo",
        component: () => import("src/pages/inventario/adicionar.vue"),
      },
      {
        path: "lista",
        component: InventarioLista,
      },
      {
        path: "v/:idInventario",
        // name: 'verInventario',
        component: () => import('src/pages/inventario/v/[id]/index.vue'),
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
                component: () => import('src/pages/inventario/v/[id]/resumo/setores.vue'),
              },
              {
                path: 'usuarios',
                name: 'resumoUsuarios',
                component: () => import('src/pages/inventario/v/[id]/resumo/usuarios.vue'),
              },
              {
                path: 'semana',
                name: 'resumoSemana',
                component: () => import('src/pages/inventario/v/[id]/resumo/semana.vue'),
              },
              {
                path: 'dia',
                name: 'resumoDia',
                component: () => import('src/pages/inventario/v/[id]/resumo/dia.vue'),
              },
            ]
          },
          {
            path: 'unidades',
            name: 'Unidades',
            component: () => import('src/pages/inventario/v/[id]/unidades.vue'),
          },
          {
            path: 'itens',
            redirect: { name: 'itensColetados' }
          },
          {
            path: 'itens/coletados',
            name: 'itensColetados',
            component: () => import('src/pages/inventario/v/[id]/itens/coletados/index.vue')
          },
          {
            path: 'itens/coletados/novo',
            name: 'itemColetadoNovo',
            component: () => import('src/pages/inventario/v/[id]/itens/coletados/[id].vue'),
          },
          {
            path: 'itens/coletados/:idItem',
            name: 'itemColetado',
            component: () => import('src/pages/inventario/v/[id]/itens/coletados/[id].vue'),
          },
          {
            path: 'itens/importados',
            name: 'itensImportados',
            component: () => import('src/pages/inventario/v/[id]/itens/importados/index.vue'),
          },
          {
            path: 'itens/importados/:idItem',
            name: 'itemImportado',
            component: () => import('src/pages/inventario/v/[id]/itens/importados/[id].vue'),
          },
          {
            path: 'permissoes',
            name: 'Permissoes',
            component: () => import('src/pages/inventario/v/[id]/permissoes.vue'),
          },
          {
            path: 'relatorio',
            name: 'relatorioGeral',
            component: () => import('src/pages/inventario/v/[id]/relatorio.vue'),
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
