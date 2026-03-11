<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { apiGet, apiPost } from "../../api/apiClient";

type Volante = {
  id: string;
  codigo: string;
  descricao: string;
};

const token: string = localStorage.getItem("token") ?? "";

// Lista de volantes carregados da API
const volantes = ref<Volante[]>([]);

// Campos do formulário
const selectedVolanteId = ref("");          // volanteId no payload
const numeroNotaFiscalRemessa = ref("");    // numeroNotaFiscal
const quantidadeVolantes = ref(1);          // quantidade
const tituloPedido = ref("");               // title
const observacoesPedido = ref("");          // description

onMounted(async () => {
  volantes.value = await apiGet("/volantes", token);
});

// Sempre que o usuário selecionar um volante, 
// preenche automaticamente o título com a descrição do volante
watch(selectedVolanteId, (novoId) => {
  if (!novoId) {
    tituloPedido.value = "";
    return;
  }

  const volanteSelecionado = volantes.value.find(
    (volante) => volante.id === novoId
  );

  if (volanteSelecionado) {
    // aqui usamos a descricao do volante como título do pedido
    tituloPedido.value = volanteSelecionado.descricao;
  } else {
    tituloPedido.value = "";
  }
});

function voltar() {
  window.location.href = "/ev-volantes/client";
}

async function criar() {
  if (!selectedVolanteId.value || !numeroNotaFiscalRemessa.value || !quantidadeVolantes.value) {
    alert("Preencha volante, nota fiscal e quantidade.");
    return;
  }

  const payload = {
    volanteId: selectedVolanteId.value,
    numeroNotaFiscal: numeroNotaFiscalRemessa.value,
    quantidade: quantidadeVolantes.value,
    title: tituloPedido.value,
    description: observacoesPedido.value,
  };

  console.log("Payload do front:", payload);

  await apiPost("/orders", token, payload);

  window.location.href = "/ev-volantes/client";
}
</script>

<template>
  <div class="container">
    <!-- HEADER COM LOGO E VOLTAR -->
    <div class="top-bar">
      <img
        src="../../../../assets/ev-volantes-logo.png"
        alt="EV Volantes"
        class="logo"
      />
      <button class="btn-voltar" @click="voltar()">Voltar</button>
    </div>

    <h2>Novo Pedido</h2>

    <label>Código do Volante *</label>
    <select v-model="selectedVolanteId" class="input">
      <option value="">Selecione...</option>
      <option v-for="volante in volantes" :key="volante.id" :value="volante.id">
        {{ volante.codigo }}
      </option>
    </select>

    <label>Descrição</label>
    <input
      v-model="tituloPedido"
      class="input"
      placeholder="Ex: Troca de volante"
      disabled
    />

    <label>Nota Fiscal de remessa para conserto *</label>
    <input
      v-model="numeroNotaFiscalRemessa"
      class="input"
      placeholder="Ex: 123456"
    />

    <label>Quantidade *</label>
    <input
      type="number"
      v-model.number="quantidadeVolantes"
      min="1"
      class="input"
    />

    <label>Observações</label>
    <textarea
      v-model="observacoesPedido"
      class="input"
      placeholder="Detalhes..."
    ></textarea>

    <button @click="criar" class="btn">Enviar Pedido</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
}

.input {
  width: 100%;
  padding: 12px;
  margin: 6px 0 14px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.btn {
  background: #5e72a8;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background: #5e72a8;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px; /* tamanho ideal para mobile */
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
