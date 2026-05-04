import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { apiGet } from "../../operisflow-web/src/modules/ev-volantes/api/apiClient";
import "./styles/base.css";

// estado simples de sessão
export const session = {
  validated: false,
};

async function bootstrap() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      // 🔒 valida sessão ANTES de montar a app
      const { data } = await apiGet("/auth/me",token);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      // token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // evita manter rota antiga
      await router.replace("/ev-volantes/login");
    }
  }

  session.validated = true;

  createApp(App)
    .use(router)
    .mount("#app");
}

bootstrap();
