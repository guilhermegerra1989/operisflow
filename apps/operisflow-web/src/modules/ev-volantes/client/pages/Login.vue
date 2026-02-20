<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../../../../assets/ev-volantes-logo.png";
import BaseButton from "../../../../components/BaseButton.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

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
</script>

<template>
  <div class="container login-wrapper">
    <form @submit.prevent="login">
      <img :src="logo" alt="Logo EV Volantes" class="logo" />

      <input v-model="email" placeholder="E-mail" />
      <input v-model="password" type="password" placeholder="Senha" />

      <!-- BaseButton substituindo o botão original -->
      <BaseButton type="submit" :loading="isLoading" label="Entrar" />

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  text-align: center;
  margin-top: 40px;
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
</style>