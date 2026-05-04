import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./styles/base.css";
import { session  } from "./auth/session";
import { validateSession  } from "./auth/authApi";

async function bootstrap() {
  const token = localStorage.getItem("token");

    try {
        if (token) {
        const { data } = await validateSession(token);
        localStorage.setItem("user", JSON.stringify(data));
        }
    } finally {
        session.validated = true;
        session.validating = false;
    }

  createApp(App).use(router).mount("#app");
}

bootstrap();
