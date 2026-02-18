<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiGet, apiPost } from "../../api/apiClient";

type Volante = {
  id: string;
  codigo: string;
  descricao: string;
};

const token: string = localStorage.getItem("token") ?? "";

const volantes = ref<Volante[]>([]);
const volanteId = ref("");
const numeroNotaFiscal = ref("");
const quantidade = ref(1);  // 👈 começa com 1
const title = ref("");
const description = ref("");

onMounted(async () => {
  volantes.value = await apiGet("/volantes", token);
});

function voltar() {
  window.location.href = "/ev-volantes/client";
}

async function criar() {
  if (!volanteId.value || !numeroNotaFiscal.value || !quantidade.value) {
    alert("Preencha volante, nota fiscal e quantidade.");
    return;
  }

  console.log("Payload do front:", {
    volanteId: volanteId.value,
    numeroNotaFiscal: numeroNotaFiscal.value,
    quantidade: quantidade.value,
    title: title.value,
    description: description.value,
  });

  await apiPost("/orders", token, {
    volanteId: volanteId.value,
    numeroNotaFiscal: numeroNotaFiscal.value,
    quantidade: quantidade.value,
    title: title.value,
    description: description.value,
  });

  window.location.href = "/ev-volantes/client";
}
</script>

<template>
  <div class="container">

    <!-- HEADER COM NOME E LOGOUT -->
   <div class="top-bar">
      <img src="../../../../assets/ev-volantes-logo.png" alt="EV Volantes" class="logo" />
      <button class="btn-voltar" @click="voltar()">Voltar</button>
    </div>

    <h2>Novo Pedido</h2>

    <label>Tipo de Volante *</label>
    <select v-model="volanteId" class="input">
      <option value="">Selecione...</option>
      <option v-for="v in volantes" :key="v.id" :value="v.id">
        {{ v.codigo }} - {{ v.descricao }}
      </option>
    </select>

    <label>Número da Nota Fiscal *</label>
    <input v-model="numeroNotaFiscal" class="input" placeholder="Ex: 123456" />

    <label>Quantidade *</label>
    <input
      type="number"
      v-model.number="quantidade"
      min="1"
      class="input"
    />

    <label>Título</label>
    <input v-model="title" class="input" placeholder="Ex: Troca de volante" />

    <label>Descrição</label>
    <textarea
      v-model="description"
      class="input"
      placeholder="Detalhes..."
    ></textarea>

    <button @click="criar" class="btn">Enviar Pedido</button>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 12px;
  margin: 6px 0 14px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}
.btn {
  background: #1e88e5;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  font-size: 16px;
}

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