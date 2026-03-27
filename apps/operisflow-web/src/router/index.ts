import { createRouter, createWebHistory } from "vue-router";

import Home from "../modules/ev-volantes/home/pages/Home.vue";
import Login from "../modules/ev-volantes/client/pages/Login.vue";
import MeusPedidos from "../modules/ev-volantes/client/pages/MeusPedidos.vue";
import NovoPedido from "../modules/ev-volantes/client/pages/NovoPedido.vue";
import UsersAdmin from "../modules/ev-volantes/admin/pages/UserAdmin.vue";
import VolantesAdmin from "../modules/ev-volantes/admin/pages/VolantesAdmin.vue";
import RotasAdmin from "../modules/ev-volantes/admin/pages/RotasAdmin.vue";
import MarcasAdmin from "../modules/ev-volantes/admin/pages/MarcasAdmin.vue";
import PedidosAdmin from "../modules/ev-volantes/admin/pages/PedidosAdmin.vue";
import DashboardAdmin from "../modules/ev-volantes/admin/pages/DashboardAdmin.vue";
import DashboardOperator from "../modules/ev-volantes/operator/pages/DashboardOperator.vue";
import StockOperator from "../modules/ev-volantes/operator/pages/StockOperator.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // NOVA ROTA PÚBLICA: site da empresa
    { path: "/", component: Home },

    // PÚBLICA - HOME
    { path: "/ev-volantes", component: Home },

    // PÚBLICA - LOGIN
    { path: "/ev-volantes/login", component: Login },

    // CLIENTE
    {
      path: "/ev-volantes/client",
      component: MeusPedidos,
      meta: { requiresAuth: true, role: "client" },
    },
    {
      path: "/ev-volantes/client/novo",
      component: NovoPedido,
      meta: { requiresAuth: true, role: "client" },
    },

    // ADMINISTRADOR
    {
      path: "/ev-volantes/admin",
      component: DashboardAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/ev-volantes/admin/users",
      component: UsersAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/ev-volantes/admin/volantes",
      component: VolantesAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/ev-volantes/admin/pedidos",
      component: PedidosAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/ev-volantes/admin/rotas",
      component: RotasAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/ev-volantes/admin/marcas",
      component: MarcasAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },

    // OPERADOR
    {
      path: "/ev-volantes/operator",
      component: DashboardOperator,
      meta: { requiresAuth: true, role: "operator" },
    },
    {
      path: "/ev-volantes/operator/estoque",
      component: StockOperator,
      meta: { requiresAuth: true, role: "operator" },
    },
  ],
  
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const isAuthenticated = !!token;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRole = to.meta.role as "client" | "admin" | "operator" | undefined;

  console.log("[ROUTER GUARD]");
  console.log("-> indo para:", to.fullPath);
  console.log("-> requiresAuth:", requiresAuth);
  console.log("-> isAuthenticated:", isAuthenticated);
  console.log("-> requiredRole:", requiredRole);
  console.log("-> user:", user);

  // 1) Tentando acessar rota protegida SEM estar logado
  if (requiresAuth && !isAuthenticated) {
    return next({
      path: "/ev-volantes/login",
      query: { redirect: to.fullPath },
    });
  }

  // 2) Se a rota exige role e o usuário não tem
  if (requiresAuth && requiredRole && user?.role !== requiredRole) {
    if (user?.role === "client") {
      return next("/ev-volantes/client");
    }

    if (user?.role === "admin") {
      return next("/ev-volantes/admin");
    }

    if (user?.role === "operator") {
      return next("/ev-volantes/operator");
    }

    return next("/ev-volantes/login");
  }

  // 3) Usuário já logado tentando ir pra tela de login
  if (to.path === "/ev-volantes/login" && isAuthenticated) {
    if (user?.role === "client") {
      return next("/ev-volantes/client");
    }
    if (user?.role === "admin") {
      return next("/ev-volantes/admin");
    }
  }

  // 4) Caso normal
  return next();
});
