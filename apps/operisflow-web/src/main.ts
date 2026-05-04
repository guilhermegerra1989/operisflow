import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./styles/base.css";
import { session } from "./auth/session";
import { validateSession } from "./auth/authApi";

async function bootstrap() {
  try {
    const user = await validateSession();
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error: any) {
    if (error.status === 401) {
      // ✅ AQUI sim é logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } finally {
    session.validated = true;
    session.validating = false;
  }

  createApp(App).use(router).mount("#app");
}

bootstrap();
