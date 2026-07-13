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


<div class="page">
  <div class="container">

    <div class="card-login">

      <div class="top-bar">
          <button class="btn-back-mobile" @click="voltarLogin">
            ←
          </button>

          <img src="../../../../assets/ev_volantes_image.png"
            alt="EV Volantes"
            class="logo"
          />

          <button class="btn-secondary btn-small desktop-only" @click="voltarLogin">
            Voltar para o Site
          </button>
      </div>

            <form @submit.prevent="login">
       

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

          <RouterLink to="/ev-volantes/cadastre">
              Cadastre-se
          </RouterLink>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
      
    </div>

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
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;
}

.logo {
  height: 70px;

  width: auto;

  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
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

  display: flex;
  justify-content: center;
  gap: 15px;
}

.forgot-password a {
  color: #5e72a8;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.page {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px;

  background:
    linear-gradient(
      135deg,
      #111111,
      #171717,
      #0d0d0d
    );
}

.container {
  width: 100%;
  max-width: 500px;
}

.card-login {
  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 24px;

  padding: 32px;

  transition: .35s ease;

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);
}

.card-login::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0,75,255,.08),
      transparent 40%
    );

  pointer-events: none;
}

.card-login:hover {
  transform: translateY(-6px);

  border-color: #004BFF;

  box-shadow:
    0 18px 45px rgba(0,75,255,.25);
}

.footer-actions {
  margin-top: 20px;
  text-align: center;
}

.btn-secondary {
  background: transparent;

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 10px 16px;

  border-radius: 10px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-secondary:hover {
  background: rgba(0,75,255,.12);

  color: white;
}

.btn-back-site {
  background: transparent;
  border: none;

  color: #94a3b8;

  font-size: 14px;

  cursor: pointer;

  transition: .2s;
}

.btn-back-site:hover {
  color: #60a5fa;
}

@media (max-width: 768px) {

  .page {
    padding: 16px;
  }

  .card-cadastro {
    padding: 22px;
  }

  .top-bar {
    flex-direction: column;

    text-align: center;
  }

  .logo {
    height: 50px;
  }

  h2 {
    font-size: 1.6rem;
  }

}

.btn-small {
  width: auto;

  padding: 4px 10px;

  font-size: 0.75rem;

  border-radius: 8px;
}

.btn-back-mobile {
  display: none;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  border: 1px solid rgba(255,255,255,.15);

  background: rgba(255,255,255,.05);

  color: white;

  font-size: 20px;

  cursor: pointer;

  transition: .25s;
}

.btn-back-mobile:hover {
  background: rgba(0,75,255,.15);

  border-color: #004BFF;
}

.desktop-only {
  display: flex;
}

@media (max-width: 768px) {

  .top-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .btn-back-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .desktop-only {
    display: none;
  }

  .logo {
    height: 42px;
  }
}


</style>