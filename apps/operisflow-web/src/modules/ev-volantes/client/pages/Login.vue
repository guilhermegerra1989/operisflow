<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../../../../assets/ev_volantes_image.png";
import BaseButton from "../../../../components/BaseButton.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const showPassword = ref(false);

async function login() {
  error.value = "";
  isLoading.value = true;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push(
      data.user.role === "client"
        ? "/ev-volantes/client"
        : "/ev-volantes/admin"
    );
  } catch {
    error.value = "Credenciais inválidas";
  } finally {
    isLoading.value = false;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes";
}
</script>

<template>
   <div class="container">

    <div class="container login-wrapper">
      <form @submit.prevent="login">
        <img :src="logo" alt="Logo EV Volantes" class="logo" @click="logout" />

        <div class="field">
          <label>E-mail</label>
          <input v-model="email" placeholder="E-mail" />
        </div>

        <div class="field">
          <label>Senha</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Senha"
            />

            <span class="toggle" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </div>

        <!-- BaseButton substituindo o botão original -->
        <BaseButton type="submit" :loading="isLoading" label="Entrar" />

        <div class="forgot-password">
          <RouterLink to="/ev-volantes/esqueci-senha">
            Esqueceu sua senha?
          </RouterLink>

          <RouterLink style="margin-left: 15px;" to="/ev-volantes/esqueci-senha">
              Não tem Cadastro?  Cadastre-se
          </RouterLink>
        </div>


        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  text-align: center;
  margin-top: 40px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  width: 360px;
  height: 360px;
  object-fit: contain;
  margin-bottom: 10px;
}

input {
  width: 100%;                /* 👈 mantém os campos grandes */
  padding: 14px 16px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  font-size: 16px;
  margin-bottom: 10px;        /* 👈 mantém espaçamento original */
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
}

.error {
  color: red;
  margin-top: 10px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo_header {
  height: 36px;         /* tamanho ideal para mobile */
  object-fit: contain;
}

.btn-logout {
  background: transparent;
  border: 1px solid #5e72a8;
  color: #5e72a8;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  max-width: 150px;
}

.btn-logout:hover {
  background: #ffebee;
}

.field {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* força label à esquerda */
  width: 100%;
}

.field label {
  margin-bottom: 4px;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding-right: 45px; /* espaço pro ícone */
}

.toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
  opacity: 0.6;
  transition: 0.2s;
}

.toggle:hover {
  opacity: 1;
}

.forgot-password {
  margin-top: 12px;
}

.forgot-password a {
  color: #5e72a8;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}


</style>