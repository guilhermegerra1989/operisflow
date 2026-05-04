import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { apiGet } from "../../operisflow-web/src/modules/ev-volantes/api/apiClient";
import "./styles/base.css";
import { session  } from "./auth/session";

async function bootstrap() {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      const { data } = await apiGet("/auth/me", token);
      localStorage.setItem("user", JSON.stringify(data));
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } finally {
    session.validated = true;
    session.validating = false;
  }

  createApp(App).use(router).mount("#app");
}

bootstrap();
