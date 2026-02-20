<script setup>
import { ref, onMounted } from "vue";
import { apiPost, apiGet } from "../../api/apiClient";

const token = localStorage.getItem("token");

const users = ref([]);
const name = ref("");
const email = ref("");
const password = ref("");

async function loadUsers() {
  users.value = await apiGet("/users", token);
}

function voltar() {
  window.location.href = "/ev-volantes/admin";
}

async function criarUsuario() {
  await apiPost("/users", token, {
    name: name.value,
    email: email.value,
    password: password.value,
    role: "client",
  });

  await loadUsers();
}

onMounted(loadUsers);
</script>

<template>
  <div class="container">


    <div class="top-bar">
      <img src="../../../../assets/ev-volantes-logo.png" alt="EV Volantes" class="logo" />
      <button class="btn-voltar" @click="voltar()">Voltar</button>
    </div>


    <h2>Usuários Clientes</h2>

    <h3>Novo Usuário</h3>
    <input v-model="name" placeholder="Nome" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" placeholder="Senha" />

    <button @click="criarUsuario">Criar Usuário</button>

    <h3>Lista</h3>
    <div v-for="u in users" :key="u.id" class="card">
      <strong>{{ u.name }}</strong><br/>
      {{ u.email }}<br/>
      <small>Role: {{ u.role }}</small>
    </div>
  </div>
</template>

<style scoped>

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px;         /* tamanho ideal para mobile */
  object-fit: contain;
}

.btn-voltar {
  background: transparent;
  border: 1px solid #e53935;
  color: #e53935;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  max-width: 100px;
}

.btn-voltar:hover {
  background: #ffebee;
}
</style>