import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./styles/base.css";
import { session } from "./auth/session";
import { validateSession } from "./auth/authApi";

async function bootstrap() {
  try {
    // NÃO valida sessão no site público
    if (!isPublicSite()) {
      const user = await validateSession();
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (error: any) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } finally {
    session.validated = true;
    session.validating = false;
  }

  createApp(App).use(router).mount("#app");
}

function isPublicSite() {
  const host = window.location.hostname;

  return [
    "evvolantes.com.br",
    "www.evvolantes.com.br"
  ].includes(host);
}

bootstrap();
