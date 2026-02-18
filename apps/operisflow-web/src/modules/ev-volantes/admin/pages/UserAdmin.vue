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