<script setup lang="ts">
import { ref, watch} from "vue";
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
const telcomercial = ref("");
const telpessoal = ref("");
const bairro = ref("");
const cep = ref("");
const estado = ref("SP");
const inscricao_estadual = ref("");
const inscricao_municipal = ref("");

const telefoneErro = ref("");

const role = ref("client");

const loading = ref(false);
const sucesso = ref(false);

const mostrarSenha = ref(false);

const estados = [
  "AC", "AL", "AP", "AM",
  "BA", "CE", "DF", "ES",
  "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR",
  "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

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
// VALIDAÇÃO
// =========================
function validar() {
    
  if (!razao_social.value) return "Razão social obrigatória";
  if (!email.value) return "Email obrigatório";
  if (!password.value) return "Senha obrigatória";

  if (!endereco.value) return "Endereço obrigatório";
  if (!cnpj.value) return "CNPJ obrigatório";
  if (!telcomercial.value) return "Telefone obrigatório";

  if (telcomercial.value.length > 50) {
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

    role: role.value,
    active: true,

    endereco: endereco.value,
    cnpj: cnpj.value,
    telefone: telcomercial.value,
    tel_comercial: telcomercial.value,
    tel_pessoal: telpessoal.value,
    bairro: bairro.value,
    cep: cep.value,
    estado: estado.value,
    inscricao_estadual: inscricao_estadual.value,
    inscricao_municipal: inscricao_municipal.value

  };

  try {
    loading.value = true;

    await apiPostPublic("/auth/register", payload);

    // ✅ sucesso visual
    sucesso.value = true;

    // ✅ redireciona depois de 2s
    setTimeout(() => {
      window.location.href = "/ev-volantes/login";
    }, 3000);

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


<div class="page">
  <div class="container">
     <div class="card-cadastro">

    <!-- HEADER -->
    <div class="top-bar">
      <button class="btn-back-mobile" @click="voltarLogin">
        ←
      </button>

       <img src="../../../../assets/ev_volantes_image.png"
        alt="EV Volantes"
        class="logo"
      />

      <button class="btn-secondary btn-small desktop-only" @click="voltarLogin">
        Voltar para login
      </button>
    </div>

    <h2>
      Cadastro de Cliente
    </h2>


    <!-- FORM -->
    <div class="form">

      <div class="field">
        <label>Nome</label>
        <input v-model="name" />
      </div>

      <div class="field required">
        <label>Razão Social</label>
        <input v-model="razao_social" />
      </div>

      <div class="field">
        <label>Nome Fantasia</label>
        <input v-model="nome_fantasia" />
      </div>

      <div class="field required">
        <label>CNPJ</label>
        <input v-model="cnpj" />
      </div>

      <div class="field required">
        <label>Email</label>
        <input v-model="email" />
      </div>

      <div class="field required">
        <label>Senha</label>

        <div class="password-wrapper">
            <input v-model="password" :type="mostrarSenha ? 'text' : 'password'" />

            <button type="button" class="btn-eye" @click="mostrarSenha = !mostrarSenha" >
              {{ mostrarSenha ? '🙈' : '👁️' }}
            </button>
        </div>
      </div>

      <div class="field required">
        <label>Tel (Comercial)</label>
        <input v-model="telcomercial" maxlength="50" />
        <small v-if="telefoneErro" class="error-text">
          {{ telefoneErro }}
        </small>
      </div>

      <div class="field">
        <label>Tel (Pessoal)</label>
        <input v-model="telpessoal" maxlength="50" />
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
      
      <button
        class="btn-primary"
        @click="cadastrarCliente"
        :disabled="loading"
      >
        {{ loading ? "Cadastrando..." : "Criar Conta" }}
      </button>

      <div v-if="sucesso" class="success-overlay">
        <div class="success-modal">
          <div class="success-icon">✅</div>

          <h3>Cadastro realizado!</h3>

          <p>
            Sua conta foi criada com sucesso.
          </p>

          <div class="spinner"></div>

          <small>Redirecionando para o login...</small>
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

/* TOPO */

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 12px;

  margin-bottom: 20px;
}

.logo {
  height: 55px;

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

/* INPUTS */

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

/* SENHA */

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
    height: 50px;
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

.success-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,.75);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;

  backdrop-filter: blur(4px);
}

.success-modal {
  width: 350px;

  padding: 30px;

  border-radius: 20px;

  text-align: center;

  background: #151515;

  color: white;

  border: 1px solid #22c55e;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 10px;
}

.spinner {
  width: 40px;
  height: 40px;

  margin: 20px auto;

  border: 4px solid rgba(255,255,255,.2);
  border-top: 4px solid #22c55e;
  border-radius: 50%;

  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}




</style>