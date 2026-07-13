import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./styles/base.css";
import { session } from "./auth/session";
import { validateSession } from "./auth/authApi";


async function bootstrap() {

  // monta a aplicação imediatamente
  createApp(App)
    .use(router)
    .mount("#app");

  const token = localStorage.getItem("token");

  // sem token = sem sessão
  if (!token) {
    session.validated = true;
    session.validating = false;
    return;
  }

  try {

    const user = await validateSession();

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    console.log("Sessão validada");

  } catch (error: any) {

    console.error("Falha na validação da sessão", error);

    // token expirado ou inválido
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // se estiver numa área protegida força login
    if (
      window.location.pathname.startsWith("/ev-volantes/admin") ||
      window.location.pathname.startsWith("/ev-volantes/client") ||
      window.location.pathname.startsWith("/ev-volantes/operator")
    ) {
      router.push("/ev-volantes/login");
    }

  } finally {

    session.validated = true;
    session.validating = false;

  }
}

bootstrap();
