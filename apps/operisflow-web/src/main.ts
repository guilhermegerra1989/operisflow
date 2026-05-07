import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./styles/base.css";
import { session } from "./auth/session";
import { validateSession } from "./auth/authApi";

async function bootstrap() {
  try {
    // NÃO valida sessão no site público
    if (!shouldSkipValidation()) {
      const user = await validateSession();
      localStorage.setItem("user", JSON.stringify(user));
      console.log('VALIDADO ---------->>> '+JSON.stringify(user))
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

function shouldSkipValidation() {
  const url = window.location.origin + window.location.pathname;

  return [
    "https://evvolantes.com.br",
    "https://evvolantes.com.br/",
    "https://evvolantes.com.br/login",

    "https://www.evvolantes.com.br",
    "https://www.evvolantes.com.br/",
    "https://www.evvolantes.com.br/login",

    // se tiver http também, já garante:
    "http://evvolantes.com.br",
    "http://evvolantes.com.br/",
    "http://evvolantes.com.br/login",

    "http://www.evvolantes.com.br",
    "http://www.evvolantes.com.br/",
    "http://www.evvolantes.com.br/login",
  ].includes(url);
}

bootstrap();
