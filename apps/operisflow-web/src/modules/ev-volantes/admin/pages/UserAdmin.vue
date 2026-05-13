<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { apiPost, apiGet, apiDelete, apiPatch } from "../../api/apiClient";

type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin" | "operator";
  active: boolean;
  rota_id?: string;
};

type Rota = {
  id: string;
  nome: string;
};

const loading = ref(false);

const users = ref<User[]>([]);
const rotas = ref<Rota[]>([]);

// ✅ rota padrão (UUID válido da API)
const defaultRotaId = ref<string | null>(null);

// FORM
const name = ref("");
const email = ref("");
const password = ref("");

const role = ref<"client" | "admin" | "operator">("admin"); // ✅ DEFAULT ADMIN
const active = ref(true);
const rotaId = ref("");

// CAMPOS CLIENTE
const endereco = ref("");
const cnpj = ref("");
const telefone = ref("");

const editingUserId = ref<string | null>(null);

const showPassword = ref(false);

// =========================
// LOAD
// =========================
async function loadUsers() {
  const [usersRes, rotasRes] = await Promise.all([
    apiGet("/users"),
    apiGet("/rotas"),
  ]);

  users.value = usersRes;
  rotas.value = rotasRes;

  // ✅ pega primeira rota como padrão (UUID válido)
  if (rotasRes.length > 0 && !defaultRotaId.value) {
    defaultRotaId.value = rotasRes[0].id;
  }
}

// =========================
// RESET
// =========================
function resetForm() {
  name.value = "";
  email.value = "";
  password.value = "";

  role.value = "admin"; // ✅ default admin
  active.value = true;

  rotaId.value = "";

  endereco.value = "";
  cnpj.value = "";
  telefone.value = "";

  editingUserId.value = null;
}

// =========================
// WATCH
// =========================
watch(role, (r) => {
  if (r !== "client") {
    endereco.value = "";
    cnpj.value = "";
    telefone.value = "";
  }
});

// =========================
// SALVAR
// =========================
async function salvarUsuario() {
  if (!name.value || !email.value) {
    alert("Nome e email obrigatórios");
    return;
  }

  if (!editingUserId.value && !password.value) {
    alert("Senha obrigatória");
    return;
  }

  // ✅ resolve rota corretamente (SEM erro TS)
  let rotaFinal: string;

  if (role.value === "client") {
    if (!rotaId.value) {
      alert("Selecione a rota");
      return;
    }
    rotaFinal = rotaId.value;
  } else {
    if (!defaultRotaId.value) {
      alert("Erro: rota padrão não carregada.");
      return;
    }
    rotaFinal = defaultRotaId.value;
  }

  // valida cliente
  if (role.value === "client") {
    if (!endereco.value || !cnpj.value || !telefone.value) {
      alert("Preencha os dados do cliente");
      return;
    }
  }

  const payload: any = {
    name: name.value,
    email: email.value,
    role: role.value,
    active: active.value,
    rota_id: rotaFinal, // ✅ SEM ERRO
  };

  if (password.value) payload.password = password.value;

  if (role.value === "client") {
    payload.endereco = endereco.value;
    payload.cnpj = cnpj.value;
    payload.telefone = telefone.value;
  }

  try {
    loading.value = true;

    if (editingUserId.value) {
      await apiPatch(`/users/${editingUserId.value}`, payload);
    } else {
      await apiPost("/users", payload);
    }

    resetForm();
    await loadUsers();
  } finally {
    loading.value = false;
  }
}

// =========================
// EDITAR
// =========================
function começarEditarUsuario(user: any) {
  editingUserId.value = user.id;
  name.value = user.name;
  email.value = user.email;
  role.value = user.role;
  active.value = user.active;

  rotaId.value = user.rota_id || "";

  endereco.value = user.endereco || "";
  cnpj.value = user.cnpj || "";
  telefone.value = user.telefone || "";

  password.value = "";
}

// =========================
// DELETE
// =========================
async function excluirUsuario(id: string) {
  if (!confirm("Excluir usuário?")) return;

  await apiDelete(`/users/${id}`);
  await loadUsers();
}

// =========================
// NAV
// =========================
function logout() {
  localStorage.clear();
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/admin";
}

onMounted(loadUsers);
</script>

<template>
  <div class="container">

    <!-- TOPO -->
    <div class="top-bar">
      <img src="../../../../assets/ev-volantes-logo.png" class="logo" />
      <div class="top-actions">
        <button class="btn-secondary" @click="voltarDashboard">Dashboard</button>
        <button class="btn-logout" @click="logout">Sair</button>
      </div>
    </div>

    <h2>Usuários</h2>

    <h3>{{ editingUserId ? 'Editar Usuário' : 'Novo Usuário' }}</h3>

    <!-- CAMPOS BASE -->
    <input v-model="name" placeholder="Nome do usuário" />
    <input v-model="email" placeholder="Email (login do sistema)" />

    <!-- SENHA -->
    <div class="field">
      <div class="pill-group">
        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Senha" />
        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
          {{ showPassword ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
    </div>

    <!-- TIPO -->
    <div class="field">
      <label>Tipo</label>
      <div class="pill-group">
        <div class="pill" :class="{ active: role === 'client' }" @click="role = 'client'">Cliente</div>
        <div class="pill" :class="{ active: role === 'admin' }" @click="role = 'admin'">Admin</div>
        <div class="pill" :class="{ active: role === 'operator' }" @click="role = 'operator'">Operador</div>
      </div>
    </div>

    <!-- STATUS -->
    <div class="field">
      <label>Status</label>
      <div class="pill-group">
        <div class="pill" :class="{ active: active }" @click="active = true">Ativo</div>
        <div class="pill" :class="{ active: !active }" @click="active = false">Inativo</div>
      </div>
    </div>

    <!-- ROTA -->
    <div v-if="role === 'client'" class="field required">
      <label>Rota</label>
      <select v-model="rotaId" class="input">
        <option value="">Selecione</option>
        <option v-for="r in rotas" :key="r.id" :value="r.id">{{ r.nome }}</option>
      </select>
    </div>

    <!-- CAMPOS CLIENTE -->
    <div v-if="role === 'client'" class="client-section">

      <div class="field">
        <label>Endereço</label>
        <input v-model="endereco" placeholder="Endereço completo" />
      </div>

      <div class="field">
        <label>CNPJ</label>
        <input v-model="cnpj" placeholder="CNPJ" />
      </div>

      <div class="field">
        <label>Telefone / Contato</label>
        <input v-model="telefone" placeholder="Telefone ou contato" />
      </div>

    </div>

    <!-- BOTÕES -->
    <div class="actions-form">
      <button @click="salvarUsuario" :disabled="loading">

        <span v-if="loading" class="btn-loading">
          <span class="spinner"></span>
          Salvando...
        </span>

        <span v-else>
          {{ editingUserId ? 'Salvar Alterações' : 'Criar Usuário' }}
        </span>

      </button>

      <button v-if="editingUserId" class="btn-cancelar" @click="resetForm">
        Cancelar Edição
      </button>
    </div>

    <!-- TABELA -->
    <h3>Lista</h3>

    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Status</th>
            <th class="actions-col"></th>
            <th class="actions-col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.active ? 'Ativo' : 'Inativo' }}</td>
            <td class="actions-col">

              <button class="icon-btn edit" @click="começarEditarUsuario(u)" title="Editar">
                ✏️
              </button>

            </td>
            <td class="actions-col">

              <button class="icon-btn delete" @click="excluirUsuario(u.id)" title="Excluir">
                🗑️
              </button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>

.container {
  padding: 16px;
  font-family: Arial, sans-serif;
}

/* =========================
   TOPO
========================= */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px;
}

.top-actions {
  display: flex;
  gap: 8px;
}

/* =========================
   BOTÕES TOPO
========================= */
.btn-secondary {
  background: transparent;
  border: 1px solid #1e88e5;
  color: #5e72a8;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e3f2fd;
}

.btn-logout {
  background: transparent;
  border: 1px solid #e53935;
  color: #e53935;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-logout:hover {
  background: #ffebee;
}

/* =========================
   HEADINGS
========================= */
h2 {
  margin-bottom: 12px;
}

h3 {
  margin-top: 10px;
}

/* =========================
   INPUTS
========================= */
input {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

/* =========================
   FIELD
========================= */
.field {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
}

.field label {
  margin-bottom: 6px;
}

/* obrigatório */
.field.required label::after {
  content: " *";
  color: #e53935;
}

/* =========================
   SELECT
========================= */
.input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* =========================
   PILLS
========================= */
.pill-group {
  display: flex;
  gap: 10px;
}

.pill {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #fafafa;
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

/* =========================
   SENHA
========================= */
.toggle-password {
  margin-left: 8px;
}

/* =========================
   CLIENTE SECTION
========================= */
.client-section {
  margin-top: 10px;
  padding: 12px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background: #fafafa;
}

/* =========================
   BOTÕES FORM
========================= */
.actions-form {
  display: flex;
  gap: 10px;
  margin: 14px 0;
}

.actions-form > button:first-child {
  background: #5e72a8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}

.actions-form > button:first-child:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancelar {
  background: transparent;
  border: 2px solid #aaa;
  padding: 8px 14px;
  border-radius: 6px;
  background: #f5dddd;
  cursor: pointer;
}

.btn-cancelar:hover {
  background: #aaa;
}

/* =========================
   SPINNER
========================= */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.5);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* =========================
   TABELA
========================= */
.table-wrapper {
  margin-top: 10px;
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: #fff;
}

.user-table thead {
  background: #f5f7fa;
}

.user-table th,
.user-table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.user-table tbody tr:hover {
  background: #fafafa;
}

.actions-col {
  text-align: right;
  white-space: nowrap;
}

/* =========================
   ICON BUTTONS
========================= */
.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: 0.2s;
  font-size: 14px;
}

.icon-btn:hover {
  background: #f0f0f0;
}

.icon-btn.edit {
  color: #5e72a8;
}

.icon-btn.delete {
  color: #e53935;
}

/* =========================
   RESPONSIVO
========================= */
@media (max-width: 600px) {
  .pill-group {
    flex-wrap: wrap;
  }

  .actions-form {
    flex-direction: column;
  }

  .actions-col {
    text-align: left;
  }
}

</style>