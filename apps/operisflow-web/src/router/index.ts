import { createRouter, createWebHistory } from "vue-router";

import Login from "../modules/ev-volantes/client/pages/Login.vue";
import MeusPedidos from "../modules/ev-volantes/client/pages/MeusPedidos.vue";
import NovoPedido from "../modules/ev-volantes/client/pages/NovoPedido.vue";
import UsersAdmin from "../modules/ev-volantes/admin/pages/UserAdmin.vue";
import VolantesAdmin from "../modules/ev-volantes/admin/pages/VolantesAdmin.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/ev-volantes/login" },

    // PÚBLICA
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
      component: UsersAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/ev-volantes/admin/volantes",
      component: VolantesAdmin,
      meta: { requiresAuth: true, role: "admin" },
    },
  ],
});


router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const isAuthenticated = !!token;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // role exigida pela rota (ex: 'client' ou 'admin')
  const requiredRole = to.matched.find((record) => record.meta.role)?.meta
    .role as "client" | "admin" | undefined;

  // 1) Tentando acessar rota protegida SEM estar logado
  if (requiresAuth && !isAuthenticated) {
    return next({
      path: "/ev-volantes/login",
      query: { redirect: to.fullPath }, // opcional
    });
  }

  // 2) Se a rota exige um role específico e o user não tem esse role
  if (requiresAuth && requiredRole && user?.role !== requiredRole) {
    // Se o usuário é client, manda pra área client
    if (user?.role === "client") {
      return next("/ev-volantes/client");
    }

    // Se é admin, manda pra área admin
    if (user?.role === "admin") {
      return next("/ev-volantes/admin");
    }

    // Caso raro: tem token mas user sem role compatível -> volta pro login
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

  // 4) Caso normal: deixa seguir
  return next();
});
