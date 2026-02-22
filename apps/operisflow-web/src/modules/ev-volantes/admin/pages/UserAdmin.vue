<script setup>
import { ref, onMounted } from "vue";
import { apiPost, apiGet, apiDelete } from "../../api/apiClient";

const token = localStorage.getItem("token");

const users = ref([]);

const name = ref("");
const email = ref("");
const password = ref("");

// novos campos
const role = ref("client");  // 'client' ou 'admin'
const active = ref(true);    // true ou false

async function loadUsers() {
  users.value = await apiGet("/users", token);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/admin";
}

async function criarUsuario() {
  if (!name.value.trim() || !email.value.trim()) {
    alert("Nome e Email são obrigatórios!");
    return;
  }

  await apiPost("/users", token, {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
    active: active.value,
  });

  name.value = "";
  email.value = "";
  password.value = "";
  role.value = "client";
  active.value = true;

  await loadUsers();
}

async function excluirUsuario(id) {
  const confirmado = window.confirm("Tem certeza que deseja excluir este usuário?");
  if (!confirmado) return;

  // Bate no controller: DELETE /users/:id
  await apiDelete(`/users/${id}`, token);
  await loadUsers();
}

onMounted(loadUsers);
</script>

<template>
  <div class="container">
    <div class="top-bar">
      <img
        src="../../../../assets/ev-volantes-logo.png"
        alt="EV Volantes"
        class="logo"
      />
      <div class="top-actions">
        <button class="btn-secondary" @click="voltarDashboard">
          Dashboard
        </button>
        <button class="btn-logout" @click="logout">
          Sair
        </button>
      </div>
    </div>

    <h2>Usuários Clientes</h2>

    <h3>Novo Usuário</h3>
    <input v-model="name" placeholder="Nome" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" placeholder="Senha" type="password" />

    <div class="field">
      <label>Tipo</label>
      <div class="pill-group">
        <div 
          class="pill" 
          :class="{ active: role === 'client' }"
          @click="role = 'client'"
        >
          Cliente
        </div>
        <div 
          class="pill" 
          :class="{ active: role === 'admin' }"
          @click="role = 'admin'"
        >
          Admin
        </div>
      </div>
    </div>

    <div class="field">
      <label>Status</label>
      <div class="pill-group">
        <div 
          class="pill" 
          :class="{ active: active === true }"
          @click="active = true"
        >
          Ativo
        </div>
        <div 
          class="pill" 
          :class="{ active: active === false }"
          @click="active = false"
        >
          Inativo
        </div>
      </div>
    </div>

    <button @click="criarUsuario">Criar Usuário</button>

    <h3>Lista</h3>
    <div v-for="u in users" :key="u.id" class="card">
      <strong>{{ u.name }}</strong><br />
      {{ u.email }}<br />
      <small>
        Role: {{ u.role }} |
        Ativo: {{ u.active ? "Sim" : "Não" }}
      </small>
      <br />
      <button class="btn-excluir" @click="excluirUsuario(u.id)">
        Excluir
      </button>
    </div>
  </div>
</template>


<style scoped>
.container {
  padding: 16px;
}

/* TOPO */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px;
  object-fit: contain;
}

.top-actions {
  display: flex;
  gap: 8px;
}

/* Botões */
.btn-secondary {
  background: transparent;
  border: 1px solid #1e88e5;
  color: #1e88e5;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e3f2fd;
}

.btn-logout {
  background: transparent;
  border: 1px solid #e53935;
  color: #e53935;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-logout:hover {
  background: #ffebee;
}

h2 {
  margin-bottom: 16px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.btn-excluir {
  margin-top: 4px;
  background: #e53935;
  border: none;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.btn-excluir:hover {
  background: #b71c1c;
}

.field {
  margin: 12px 0;
  font-size: 14px;
  font-weight: 600;
}

.pill-group {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.pill {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #fafafa;
  transition: 0.2s;
  font-size: 13px;
}

.pill:hover {
  background: #eee;
}

.pill.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}
</style>
