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

    // CLIENTE
    { path: "/ev-volantes/login", component: Login },

    {
      path: "/ev-volantes/client",
      component: MeusPedidos,
      meta: { requiresAuth: true },
    },
    {
      path: "/ev-volantes/client/novo",
      component: NovoPedido,
      meta: { requiresAuth: true },
    },

    // ADMINISTRADOR
    {
      path: "/ev-volantes/admin",
      component: UsersAdmin,
      meta: { requiresAuth: true },
    },
    {
      path: "/ev-volantes/admin/volantes",
      component: VolantesAdmin,
      meta: { requiresAuth: true },
    },
  ],
});

// Guard global
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");

  const isAuthenticated = !!token;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    return next({
      path: "/ev-volantes/login",
      query: { redirect: to.fullPath },
    });
  }

  if (to.path === "/ev-volantes/login" && isAuthenticated) {
    return next("/ev-volantes/client");
  }

  return next();
});