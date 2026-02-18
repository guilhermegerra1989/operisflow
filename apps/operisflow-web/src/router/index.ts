import { createRouter, createWebHistory } from "vue-router";

import Login from "../modules/ev-volantes/client/pages/Login.vue";
import MeusPedidos from "../modules/ev-volantes/client/pages/MeusPedidos.vue";
import NovoPedido from "../modules/ev-volantes/client/pages/NovoPedido.vue";
import UsersAdmin from "../modules/ev-volantes/admin/pages/UserAdmin.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/ev-volantes/login" },

    // CLIENTE
    { path: "/ev-volantes/login", component: Login },
    { path: "/ev-volantes/client", component: MeusPedidos },
    { path: "/ev-volantes/client/novo", component: NovoPedido },

    // ADMINISTRADOR
    { path: "/ev-volantes/admin", component: UsersAdmin },
  ]
});