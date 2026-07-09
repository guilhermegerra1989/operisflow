<script setup lang="ts">

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

    <h2>EM CONSTRUÇÃO</h2>


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