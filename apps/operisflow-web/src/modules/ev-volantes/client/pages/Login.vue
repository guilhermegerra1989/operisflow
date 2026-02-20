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

    if (data.user.role === "client") {
      router.push("/ev-volantes/client");
    } else {
      router.push("/ev-volantes/admin");
    }
  } catch {
    error.value = "Credenciais inválidas";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container login-wrapper">
    <form @submit.prevent="login" class="login-form">
      <img :src="logo" alt="Logo EV Volantes" class="logo" />

      <input v-model="email" placeholder="E-mail" />
      <input v-model="password" type="password" placeholder="Senha" />

      <BaseButton
        type="submit"
        :loading="isLoading"
        label="Entrar"
        variant="primary"
        :fullWidth="true"
      />

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  text-align: center;
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.login-form {
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.logo {
  width: 260px;
  height: 260px;
  object-fit: contain;
  margin-bottom: 10px;
}

input {
  width: 260px;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
}

.error {
  color: #dc2626;
  margin-top: 10px;
  font-size: 13px;
}
</style>