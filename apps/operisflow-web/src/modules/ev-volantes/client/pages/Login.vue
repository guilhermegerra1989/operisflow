<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../../../../assets/ev-volantes-logo.png";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = "";

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

    if (data.user.role === "client") {
      router.push("/ev-volantes/client");
    } else {
      router.push("/ev-volantes/admin");
    }

  } catch {
    error.value = "Credenciais inválidas";
  }
}
</script>

<template>
  <div class="container login-wrapper">

    <!-- FORM -->
    <form @submit.prevent="login">
      <img :src="logo" alt="Logo EV Volantes" class="logo" />

      <input v-model="email" placeholder="E-mail" />
      <input v-model="password" type="password" placeholder="Senha" />

      <button type="submit">Entrar</button>

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

.title {
  font-size: 26px;
  margin-bottom: 25px;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>