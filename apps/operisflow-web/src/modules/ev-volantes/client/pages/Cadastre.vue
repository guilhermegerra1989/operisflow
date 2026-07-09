<script setup lang="ts">
import { ref } from "vue";
import { apiPostPublic } from "../../api/apiClient";

// =========================
// FORM
// =========================
const name = ref("");
const nome_fantasia = ref("");
const razao_social = ref("");
const email = ref("");
const password = ref("");

const endereco = ref("");
const cnpj = ref("");
const telefone = ref("");

const loading = ref(false);
const sucesso = ref(false);

// =========================
// VALIDAÇÃO
// =========================
function validar() {
    debugger
  if (!name.value) return "Nome obrigatório";
  if (!nome_fantasia.value) return "Nome fantasia obrigatório";
  if (!razao_social.value) return "Razão social obrigatória";
  if (!email.value) return "Email obrigatório";
  if (!password.value) return "Senha obrigatória";

  if (!endereco.value) return "Endereço obrigatório";
  if (!cnpj.value) return "CNPJ obrigatório";
  if (!telefone.value) return "Telefone obrigatório";

  if (telefone.value.length > 50) {
    return "Telefone máximo 50 caracteres";
  }

  return null;
}

// =========================
// CADASTRAR
// =========================
async function cadastrarCliente() {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  const erro = validar();

  if (erro) {
    alert(erro);
    return;
  }

  const payload = {
    name: name.value,
    nome_fantasia: nome_fantasia.value,
    razao_social: razao_social.value,
    email: email.value,
    password: password.value,

    role: "client",
    active: true,

    endereco: endereco.value,
    cnpj: cnpj.value,
    telefone: telefone.value,
  };

  try {
    loading.value = true;

    await apiPostPublic("/auth/register", payload);

    // ✅ sucesso visual
    sucesso.value = true;

    // ✅ redireciona depois de 2s
    setTimeout(() => {
      window.location.href = "/ev-volantes/login";
    }, 2000);

  } catch {
    alert("Erro ao cadastrar");
  } finally {
    loading.value = false;
  }
}

// =========================
// NAV
// =========================
function voltarLogin() {
  window.location.href = "/ev-volantes/login";
}
</script>

<template>
  <div class="container">

    <!-- HEADER -->
    
    <div class="top-bar">
      <img
        src="../../../../assets/ev-volantes-logo.png"
        alt="EV Volantes"
        class="logo"
      />

      <button class="btn-secondary" @click="voltarLogin">
        Voltar para login
      </button>
    </div>

    <h2>Cadastro de Cliente</h2>

    <!-- ✅ MENSAGEM SUCESSO -->
    <div v-if="sucesso" class="sucesso-msg">
      ✅ Cliente cadastrado com sucesso! Redirecionando...
    </div>

    <!-- FORM -->
    <div class="form">

      <div class="field required">
        <label>Nome</label>
        <input v-model="name" />
      </div>

      <div class="field required">
        <label>Nome Fantasia</label>
        <input v-model="nome_fantasia" />
      </div>

      <div class="field required">
        <label>Razão Social</label>
        <input v-model="razao_social" />
      </div>

      <div class="field required">
        <label>Email</label>
        <input v-model="email" />
      </div>

      <div class="field required">
        <label>Senha</label>
        <input v-model="password" type="password" />
      </div>

      <div class="field required">
        <label>Endereço</label>
        <input v-model="endereco" />
      </div>

      <div class="field required">
        <label>CNPJ</label>
        <input v-model="cnpj" />
      </div>

      <div class="field required">
        <label>Telefone</label>
        <input v-model="telefone" maxlength="50" />
      </div>

      <button @click="cadastrarCliente" :disabled="loading">
        {{ loading ? "Cadastrando..." : "Criar Conta" }}
      </button>

    </div>

  </div>
</template>

<style>
.container {
  padding: 16px;
  max-width: 480px;
  margin: 40px auto;
}

/* Topo */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px; /* bom para mobile e desktop */
  object-fit: contain;
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
  max-width: 100px;
}

.btn-logout:hover {
  background: #ffebee;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #5e72a8;
  color: #5e72a8;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #eef2ff;
}

/* TÍTULO */
h2 {
  margin-bottom: 16px;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* CAMPOS */
.field {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
}

.field label {
  margin-bottom: 5px;
}

/* obrigatório */
.field.required label::after {
  content: " *";
  color: #e53935;
}

/* INPUTS */
input,
select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: 0.2s;
}

input:focus,
select:focus {
  border-color: #5e72a8;
  outline: none;
}

/* BOTÃO */
button {
  margin-top: 12px;
  background: #5e72a8;
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #475a90;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* SUCESSO */
.sucesso-msg {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 14px;
  font-weight: 600;
  text-align: center;
  border: 1px solid #c8e6c9;
}
</style>