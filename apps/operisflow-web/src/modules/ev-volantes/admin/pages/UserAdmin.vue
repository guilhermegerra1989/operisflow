<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiPost, apiGet, apiDelete, apiPatch } from "../../api/apiClient";

const token: string = localStorage.getItem("token") ?? "";

type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin" | "operator";
  active: boolean;
};

const users = ref<User[]>([]);

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");

const role = ref<"client" | "admin" | "operator">("client");
const active = ref<boolean>(true);

const editingUserId = ref<string | null>(null);

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

function resetForm() {
  name.value = "";
  email.value = "";
  password.value = "";
  role.value = "client";
  active.value = true;
  editingUserId.value = null;
}

type UserPayload = {
  name: string;
  email: string;
  role: "client" | "admin" | "operator";
  active: boolean;
  password?: string;
};

async function salvarUsuario() {
  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    alert("Nome, Email e Senha são obrigatórios!");
    return;
  }

  const payload: UserPayload = {
    name: name.value,
    email: email.value,
    role: role.value,
    active: active.value,
  };

  if (password.value.trim()) {
    payload.password = password.value;
  }

  if (editingUserId.value) {
    await apiPatch(`/users/${editingUserId.value}`, token, payload);
  } else {
    await apiPost("/users", token, {
      ...payload,
      password: password.value, // ainda obrigatório pra criar
    });
  }

  resetForm();
  await loadUsers();
}

function começarEditarUsuario(user: User) {
  editingUserId.value = user.id;
  name.value = user.name;
  email.value = user.email;
  role.value = user.role;
  active.value = user.active;
  password.value = "";
}

async function excluirUsuario(id: string) {
  const confirmado = window.confirm("Tem certeza que deseja excluir este usuário?");
  if (!confirmado) return;

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

    <h3>{{ editingUserId ? 'Editar Usuário' : 'Novo Usuário' }}</h3>

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
        <div 
          class="pill" 
          :class="{ active: role === 'operator' }"
          @click="role = 'operator'"
        >
          Operador
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

    <div class="actions-form">
      <button @click="salvarUsuario">
        {{ editingUserId ? 'Salvar Alterações' : 'Criar Usuário' }}
      </button>

      <button
        v-if="editingUserId"
        class="btn-cancelar"
        @click="resetForm"
      >
        Cancelar edição
      </button>
    </div>

    <h3>Lista</h3>
    <div v-for="u in users" :key="u.id" class="card">
      <strong>{{ u.name }}</strong><br />
      {{ u.email }}<br />
      <small>
        Role: {{ u.role }} |
        Ativo: {{ u.active ? "Sim" : "Não" }}
      </small>
      <br />
      <div class="card-actions">
        <button class="btn-editar" @click="começarEditarUsuario(u)">
          Editar
        </button>
        <button class="btn-excluir" @click="excluirUsuario(u.id)">
          Excluir
        </button>
      </div>
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

/* Botões topo */
.btn-secondary {
  background: transparent;
  border: 1px solid #1e88e5;
  color: #5e72a8;
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

/* Cards de usuário */
.card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

/* Botões de ação na lista */
.btn-excluir {
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

.btn-editar {
  background: #5e72a8;
  border: none;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.btn-editar:hover {
  background: #0d47a1;
}

/* Form */
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
  background: #5e72a8;
  color: white;
  border-color: #5e72a8;
}

/* Botões do formulário (criar/editar + cancelar) */
.actions-form {
  display: flex;
  gap: 10px;
  margin: 12px 0 20px;
}

.actions-form > button:first-child {
  background: #5e72a8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.actions-form > button:first-child:hover {
  background: #5e72a8;
}

.btn-cancelar {
  background: transparent;
  border: 1px solid #aaa;
  color: #555;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-cancelar:hover {
  background: #f5f5f5;
}
</style>