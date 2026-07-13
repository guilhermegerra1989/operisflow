<script setup lang="ts">
import { ref } from "vue";
import { apiPostPublic } from "../../api/apiClient";

const cnpj = ref("");
const email = ref("");

const novaSenha = ref("");
const confirmarSenha = ref("");

const mostrarSenha = ref(false);
const mostrarConfirmacao = ref(false);

const loading = ref(false);
const sucesso = ref(false);

function validar() {

  if (!cnpj.value) {
    return "CNPJ obrigatório";
  }

  if (!email.value) {
    return "Email obrigatório";
  }

  if (!novaSenha.value) {
    return "Nova senha obrigatória";
  }

  if (!confirmarSenha.value) {
    return "Confirmação da senha obrigatória";
  }

  if (novaSenha.value !== confirmarSenha.value) {
    return "As senhas não coincidem";
  }

  return null;
}

async function redefinirSenha() {

  const erro = validar();

  if (erro) {
    alert(erro);
    return;
  }

  try {

    loading.value = true;

    await apiPostPublic(
      "/auth/reset-password",
      {
        cnpj: cnpj.value,
        email: email.value,
        password: novaSenha.value
      }
    );

    sucesso.value = true;

    setTimeout(() => {
      window.location.href = "/ev-volantes/login";
    }, 2500);

  } catch {

    alert(
      "Não foi possível atualizar a senha."
    );

  } finally {

    loading.value = false;

  }
}

function voltarLogin() {
  window.location.href = "/ev-volantes/login";
}
</script>


<template>

<div class="page">

  <div class="container">

    <div class="card-cadastro">

      <div class="top-bar">

        <img
          src="../../../../assets/ev_volantes_image.png"
          alt="EV Volantes"
          class="logo"
        />

        <button
          class="btn-secondary btn-small"
          @click="voltarLogin"
        >
          Voltar para login
        </button>

      </div>

      <h2>Recuperar Senha</h2>

      <p class="subtitle">
        Informe seus dados para redefinir a senha.
      </p>

      <div
        v-if="sucesso"
        class="sucesso-msg"
      >
        ✅ Senha atualizada com sucesso.
        Redirecionando...
      </div>

      <div class="form">

        <div class="field required">
          <label>CNPJ</label>
          <input v-model="cnpj" />
        </div>

        <div class="field required">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
          />
        </div>

        <div class="field required">

          <label>Nova Senha</label>

          <div class="password-wrapper">

            <input
              v-model="novaSenha"
              :type="
                mostrarSenha
                  ? 'text'
                  : 'password'
              "
            />

            <button
              type="button"
              class="btn-eye"
              @click="
                mostrarSenha =
                !mostrarSenha
              "
            >
              {{ mostrarSenha ? '🙈' : '👁️' }}
            </button>

          </div>

        </div>

        <div class="field required">

          <label>Confirmar Senha</label>

          <div class="password-wrapper">

            <input
              v-model="confirmarSenha"
              :type="
                mostrarConfirmacao
                  ? 'text'
                  : 'password'
              "
            />

            <button
              type="button"
              class="btn-eye"
              @click="
                mostrarConfirmacao =
                !mostrarConfirmacao
              "
            >
              {{ mostrarConfirmacao ? '🙈' : '👁️' }}
            </button>

          </div>

        </div>

        <button
          class="btn-primary"
          @click="redefinirSenha"
          :disabled="loading"
        >
          {{
            loading
              ? "Atualizando..."
              : "Atualizar Senha"
          }}
        </button>

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


.subtitle {
  text-align: center;

  color: #94a3b8;

  margin-top: -10px;
  margin-bottom: 24px;

  line-height: 1.5;
}

</style>
