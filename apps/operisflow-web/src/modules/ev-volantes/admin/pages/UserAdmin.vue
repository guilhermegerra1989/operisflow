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
  nome_fantasia?: string;
  razao_social?: string;
  password?: string;
};

type Rota = {
  id: string;
  nome: string;
};

const loading = ref(false);

const users = ref<User[]>([]);
const rotas = ref<Rota[]>([]);

const estados = [
  "AC", "AL", "AP", "AM",
  "BA", "CE", "DF", "ES",
  "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR",
  "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

// ✅ rota padrão (UUID válido da API)
const defaultRotaId = ref<string | null>(null);

// FORM
const name = ref("");
const nome_fantasia = ref("");
const razao_social = ref("");
const email = ref("");
const password = ref("");

const role = ref<"client" | "admin" | "operator">("admin"); // ✅ DEFAULT ADMIN
const active = ref(true);
const rotaId = ref("");

const telefoneErro = ref("");

// CAMPOS CLIENTE
const endereco = ref("");
const cnpj = ref("");
const telefone = ref("");


const telcomercial = ref("");
const telpessoal = ref("");
const bairro = ref("");
const cep = ref("");
const estado = ref("");
const inscricao_estadual = ref("");
const inscricao_municipal = ref("");

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
  nome_fantasia.value = "";
  razao_social.value = "";
  email.value = "";
  password.value = "";

  role.value = "admin"; // ✅ default admin
  active.value = true;

  rotaId.value = "";

  endereco.value = "";
  cnpj.value = "";
  telefone.value = "";

  telcomercial.value = "";
  telpessoal.value = "";
  bairro.value = "";
  cep.value = "";
  estado.value = "";
  inscricao_estadual.value = "";
  inscricao_municipal.value = "";

  editingUserId.value = null;
}

// =========================
// WATCH
// =========================
watch(role, (r) => {
  if (r !== "client") {
    resetForm();
  }
});

watch(telcomercial, (val) => {
  if (val.length > 50) {
    telefoneErro.value = "Máximo de 50 caracteres";
  } else {
    telefoneErro.value = "";
  }
});

watch(telpessoal, (val) => {
  if (val.length > 50) {
    telefoneErro.value = "Máximo de 50 caracteres";
  } else {
    telefoneErro.value = "";
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

  if (telefone.value.length > 50) {
    alert("Telefone deve ter no máximo 50 caracteres");
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
    nome_fantasia: nome_fantasia.value,
    razao_social: razao_social.value,
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
  nome_fantasia.value = user.nome_fantasia;
  razao_social.value = user.razao_social;
  email.value = user.email;
  role.value = user.role;
  active.value = user.active;

  rotaId.value = user.rota_id || "";

  endereco.value = user.endereco || "";
  cnpj.value = user.cnpj || "";
  telcomercial.value = user.telcomercial || "";
  telpessoal.value = user.telpessoal || "";
  cep.value = user.cep || "";
  bairro.value = user.bairro || "";
  estado.value = user.estado || "";
  inscricao_estadual.value = user.inscricao_estadual || "";
  inscricao_municipal.value = user.inscricao_municipal || "";

  password.value = user.password || "";
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


<div class="page">
  <div class="container">
     <div class="card-cadastro">

    <!-- HEADER -->
    <div class="top-bar">
      
      <div class="left-actions">
        <button class="btn-back-mobile" @click="logout">
          ←
        </button>

        <button class="btn-back-mobile" @click="voltarDashboard">
          ^
        </button>
      </div>

       <img src="../../../../assets/ev_volantes_image.png"
          alt="EV Volantes"
          class="logo"
        />

      <div class="right-actions">
        <button class="btn-secondary btn-small desktop-only" @click="voltarDashboard">
          Dashboard
        </button>

        <button class="btn-secondary btn-small desktop-only" @click="logout">
          Sair
        </button>
      </div>
    </div>


<div class="container">

    <h2>{{ editingUserId ? 'Editar Usuário' : 'Novo Usuário' }}</h2>

      <div class="field required">
        <label>Tipo</label>
        <div class="role-selector">
          <div class="role-card" :class="{ active: role === 'client' }" @click="role = 'client'">
            <span>🏢</span>
            <strong>Cliente</strong>
            <small>Cadastro empresarial</small>
          </div>

          <div class="role-card" :class="{ active: role === 'admin' }" @click="role = 'admin'" >
            <span>👑</span>
            <strong>Administrador</strong>
            <small>Acesso total</small>
          </div>

          <div class="role-card" :class="{ active: role === 'operator' }" @click="role = 'operator'">
            <span>⚙️</span>
            <strong>Operador</strong>
            <small>Operação diária</small>
          </div>
        </div>
      </div>


    <div class="field">
        <label>Nome</label>
        <input v-model="name" placeholder="Nome do usuário" />
    </div>

     <div v-if="role === 'client'" class="field required">
        <div class="field required">
            <label>Razão Social</label>
            <input v-model="razao_social" placeholder="Razão Social" />
        </div>

        <div class="field">
            <label>Nome Fantasia</label>
            <input v-model="nome_fantasia" placeholder="Nome Fantasia" />
        </div>

        <div class="field required">
            <label>CNPJ</label>
            <input v-model="cnpj" placeholder="CNPJ" />
        </div>
    </div>

    <div class="field required">
        <label>Email</label>
        <input v-model="email" placeholder="Email (login do sistema)" />
     </div>

    <div class="field required">
        <label>Senha</label>
        <div class="password-row">
          <input v-model="password":type="showPassword ? 'text' : 'password'" placeholder="Digite a senha" />
          <button type="button" class="btn-visibility" @click="showPassword = !showPassword"    >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
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

      <div class="field required">
        <label>Tel (Comercial)</label>
        <input v-model="telcomercial" maxlength="50" :class="{ 'input-error': telefoneErro }"/>
        <small v-if="telefoneErro" class="error-text">
          {{ telefoneErro }}
        </small>
      </div>

      <div class="field">
        <label>Tel (Pessoal)</label>
        <input v-model="telpessoal" maxlength="50" :class="{ 'input-error': telefoneErro }" />
        <small v-if="telefoneErro" class="error-text">
          {{ telefoneErro }}
        </small>
      </div>

      <div class="field required">
        <label>Endereço</label>
        <input v-model="endereco" />
      </div>

      <div class="field required">
        <label>Bairro</label>
        <input v-model="bairro" />
      </div>

      <div class="field required">
        <label>Estado / UF</label>

        <select v-model="estado">
          <option
            v-for="uf in estados"
            :key="uf"
            :value="uf"
          >
            {{ uf }}
          </option>
        </select>
      </div>

      <div class="field required">
        <label>Cep</label>
        <input v-model="cep" />
      </div>

      <div class="field required">
        <label>IE (Incrição Estadual)</label>
        <input v-model="inscricao_estadual" />
      </div>

      <div class="field">
        <label>IM (Incrição Municipal)</label>
        <input v-model="inscricao_municipal" />
      </div>

    </div>


    <!-- STATUS -->
    <div class="field required">
      <label>Status</label>

      <div class="status-selector">

        <div class="status-card ativo" :class="{ active: active }" @click="active = true">
          <span>✅</span>
          <strong>Ativo</strong>
          <small>Usuário pode acessar o sistema</small>
        </div>

        <div class="status-card inativo" :class="{ active: !active }" @click="active = false">
          <span>❌</span>
          <strong>Inativo</strong>
          <small>Usuário sem acesso ao sistema</small>
        </div>

      </div>
    </div>

    <!-- BOTÕES -->
    <button  class="btn-save" @click="salvarUsuario" :disabled="loading" >
      <span v-if="loading">
        Salvando...
      </span>

      <span v-else>
        {{ editingUserId  ? 'Salvar Alterações' : 'Criar Usuário' }}
      </span>
    </button>


    <!-- TABELA -->

    <div class="table-card">

      <h3>Lista de Usuários</h3>

      <div class="table-wrapper">
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

    </div>

  </div>


    </div>
  </div>

</div>


</template>

<style scoped>

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
  max-width: 700px;
}

.card-cadastro {
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

.card-cadastro::before {

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

.card-cadastro:hover {

  transform: translateY(-6px);

  border-color: #004BFF;

  box-shadow:
    0 18px 45px rgba(0,75,255,.25);
}

.top-bar {
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
}

.logo {
  position: absolute;

  left: 10%;
  transform: translateX(-50%);

  height: 65px;

  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
}

/* TITULO */

h2 {
  text-align: center;

  color: white;

  font-size: 2rem;

  margin-bottom: 24px;
}

/* FORM */

.form {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;

  margin-bottom: 18px;
}

.field label {
  margin-bottom: 6px;

  color: #cbd5e1;

  font-size: .9rem;

  font-weight: 600;
}

.field.required label::after {
  content: " *";

  color: #ef4444;
}

input,
select {
   appearance: none;

  width: 100%;

  padding: 12px 14px;

  border-radius: 12px;

  border: 1px solid rgba(255,255,255,.08);

  background: rgba(255,255,255,.03);

  color: white;

  font-size: 14px;

  transition: .25s;
}

input::placeholder {
  color: #94a3b8;
}

input:focus,
select:focus {
  outline: none;

  border-color: #004BFF;

  box-shadow:
    0 0 0 4px rgba(0,75,255,.15);
}

.form-card,
.table-card {
  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.08);

  border-radius: 18px;

  padding: 24px;

  margin-bottom: 20px;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 50px;
}

.btn-eye {
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  background: transparent !important;

  border: none;

  color: #94a3b8;

  cursor: pointer;

  font-size: 18px;

  padding: 0;
  margin: 0;

  width: auto;

  box-shadow: none;
}

.btn-eye:hover {
  color: #004BFF;
  background: transparent !important;
  transform: translateY(-50%);
}

/* BOTÃO PRINCIPAL */

.btn-primary {
  width: 100%;

  margin-top: 12px;

  padding: 14px;

  border-radius: 12px;

  border: none;

  background: #004BFF;

  color: white;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;

  box-shadow:
    0 8px 20px rgba(0,75,255,.25);
}

.btn-primary:hover {
  background: #0038c7;

  transform: translateY(-2px);

  box-shadow:
    0 12px 28px rgba(0,75,255,.35);
}

.btn-primary:disabled {
  opacity: .6;

  cursor: not-allowed;

  transform: none;
}

/* BOTÃO VOLTAR */

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

/* SUCESSO */

.sucesso-msg {
  margin-bottom: 20px;

  padding: 16px;

  border-radius: 12px;

  text-align: center;

  font-weight: 700;

  color: #86efac;

  background: rgba(34,197,94,.12);

  border: 1px solid rgba(34,197,94,.35);
}

/* RESPONSIVO */

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
    position: absolute;

    left: auto;
    right: 10px;

    transform: none;

    height: 42px;
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


.left-actions,
.right-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.role-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.role-card {
  padding: 18px;

  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 6px;

  border-radius: 14px;

  cursor: pointer;

  color: white;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.08);

  transition: .25s;
}

.role-card:hover {
  border-color: #004BFF;
}

.role-card.active {
  border-color: #004BFF;

  background: rgba(0,75,255,.15);

  box-shadow: 0 0 20px rgba(0,75,255,.20);
}

.role-card span {
  font-size: 28px;
}

.role-card small {
  color: #94a3b8;
}

.status-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.status-card {
  padding: 16px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  gap: 6px;

  cursor: pointer;

  color: white;

  border-radius: 14px;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.08);

  transition: .25s;
}

.status-card span {
  font-size: 26px;
}

.status-card small {
  color: #94a3b8;
}

.status-card:hover {
  transform: translateY(-2px);
}

.status-card.ativo.active {
  border-color: #22c55e;
  background: rgba(34,197,94,.15);

  box-shadow:
    0 0 20px rgba(34,197,94,.20);
}

.status-card.inativo.active {
  border-color: #ef4444;
  background: rgba(239,68,68,.15);

  box-shadow:
    0 0 20px rgba(239,68,68,.20);
}

.password-row {
  display: flex;

  gap: 12px;

  align-items: stretch;

  margin-top: 4px;
}


.password-row input {
  flex: 1;
}

.btn-visibility {
  
 width: 60px;

  min-width: 60px;

  font-size: 18px;


  border-radius: 12px;

  border: 1px solid rgba(255,255,255,.08);

  background: rgba(255,255,255,.03);

  color: white;

  cursor: pointer;

  transition: .25s;
}

.btn-visibility:hover {
  border-color: #004BFF;
  background: rgba(0,75,255,.12);
}

.btn-save {
  width: 100%;

  margin-top: 24px;

  padding: 16px;

  border: none;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #004BFF,
      #2563eb
    );

  color: white;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;

  box-shadow:
    0 10px 25px rgba(0,75,255,.25);
}

.btn-save:hover {
  transform: translateY(-2px);

  box-shadow:
    0 15px 35px rgba(0,75,255,.35);
}

</style>