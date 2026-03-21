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

    <!-- Dados gerais do pedido -->
    <label>Título do Pedido *</label>
    <input
      v-model="tituloPedido" disabled
      class="input"
      placeholder="Ex: Pedido de conserto"
    />

    <label>Observações</label>
    <textarea
      v-model="observacoesPedido"
      class="input"
      placeholder="Detalhes adicionais do pedido..."
    ></textarea>

    <hr class="divider" />

    <!-- Seção de itens -->
    <h3>Itens do Pedido</h3>

    <!-- Fluxo de adicionar item -->
    <div class="card-add-item">
      <!-- Etapa idle: só botão adicionar -->
      <button
        v-if="uiStep === 'idle'"
        class="btn-outline"
        @click="iniciarAdicionarItem"
      >
        + Adicionar item
      </button>

      <!-- Etapa marcas: mostra as marcas como botões -->
      <div v-else-if="uiStep === 'marcas'">
        <p class="mensagem-passos">Escolha uma marca:</p>
        <div class="marcas-grid">
          <button
            v-for="marca in marcas"
            :key="marca.id"
            class="btn-marca"
            @click="selecionarMarca(marca.id)"
          >
            {{ marca.nome }}
          </button>
        </div>

        <button class="btn-secundario" @click="cancelarSelecaoMarca">
          Voltar
        </button>
      </div>

      <!-- Etapa modelos: mostra modelos da marca selecionada -->
      <div v-else-if="uiStep === 'modelos'">
        <p class="mensagem-passos">
          Selecione as quantidades para os modelos da marca:
          <strong>
            {{
              marcas.find((m) => m.id === selectedMarcaId)?.nome || "Marca"
            }}
          </strong>
        </p>

        <div class="modelos-lista">
          <div
            v-for="volante in volantesFiltrados"
            :key="volante.id"
            class="modelo-row"
          >
            <div class="modelo-info">
              <div class="modelo-codigo">{{ volante.codigo }}</div>
              <div class="modelo-descricao">{{ volante.descricao }}</div>
            </div>
            

            <div class="stepper">
              <button
                class="stepper-btn"
                @click="quantidadesSelecionadas[volante.id] = Math.max(0, (quantidadesSelecionadas[volante.id] || 0) - 1)"
              >
                -
              </button>

              <input
                class="stepper-input"
                type="number"
                min="0"
                v-model.number="quantidadesSelecionadas[volante.id]"
              />

              <button
                class="stepper-btn"
                @click="quantidadesSelecionadas[volante.id] = (quantidadesSelecionadas[volante.id] || 0) + 1"
              >
                +
              </button>
            </div>

          </div>
        </div>

        <div class="acoes-modelos">
          <button class="btn-secundario" @click="cancelarSelecaoModelos">
            Voltar
          </button>
          <button class="btn-outline" @click="confirmarModelos">
            Adicionar itens
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de itens já adicionados -->
    <div v-if="itens.length" class="itens-lista">

  <h4>Itens adicionados</h4>

  <!-- Agrupamento por marca -->
      <div
        v-for="(grupo, marcaId) in itensAgrupados"
        :key="marcaId"
        class="grupo-marca"
      >
        <div class="grupo-titulo">{{ grupo.marcaNome }}</div>

        <div
          class="grupo-item"
          v-for="(it, idx) in grupo.itens"
          :key="it.volanteId"
        >
          <div class="grupo-item-info">
            <div class="grupo-item-codigo">{{ it.codigo }}</div>
            <div class="grupo-item-descricao">{{ it.descricao }}</div>
          </div>

          <div class="grupo-item-acoes">
            <span class="grupo-item-qtd">x{{ it.quantidade }}</span>
            <button
              class="grupo-item-remove"
              @click="removerItemPorId(it.volanteId)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <button @click="criar" class="btn-enviar">
      Enviar Pedido
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { apiGet, apiPost } from "../../api/apiClient";

type Marca = {
  id: string;
  nome: string;
  descricao?: string;
};

type Volante = {
  id: string;
  codigo: string;
  descricao: string;
  marcaId: string;       // importante: vindo da API
  marcaNome?: string;    // opcional, se você quiser já mandar do backend
};

type ItemPedido = {
  marcaId: string;
  marcaNome: string;
  volanteId: string;
  codigo: string;
  descricao: string;
  quantidade: number;
};

type UIStep = "idle" | "marcas" | "modelos";

const token: string = localStorage.getItem("token") ?? "";

// Dados vindos da API
const marcas = ref<Marca[]>([]);
const volantes = ref<Volante[]>([]);

// Campos gerais do pedido
const tituloPedido = ref("");
const observacoesPedido = ref("");

// Info do usuário logado (para montar o título)
const currentUserName = ref("");
const currentRouteName = ref("");


// Controle de fluxo da UI (etapas de adicionar item)
const uiStep = ref<UIStep>("idle"); // 'idle' | 'marcas' | 'modelos'

// Controle do "form" de adicionar item
const selectedMarcaId = ref("");
const quantidadesSelecionadas = ref<Record<string, number>>({}); // { [volanteId]: quantidade }

// Lista de itens do pedido (JSON)
const itens = ref<ItemPedido[]>([]);

// Carrega marcas e volantes ao montar a tela
onMounted(async () => {
  const [marcasResponse, volantesResponse, meResponse] = await Promise.all([
    apiGet("/marcas", token),
    apiGet("/volantes", token),
    apiGet("/auth/me", token), 

  ]);

  marcas.value = marcasResponse;

  // Adaptar campos snake_case -> camelCase
  volantes.value = volantesResponse.map((v: any) => ({
    id: v.id,
    codigo: v.codigo,
    descricao: v.descricao,
    marcaId: v.marca_id ?? v.marcaId,       // cobre os dois jeitos
    marcaNome: v.marca_nome ?? v.marcaNome, // se você fizer join com marcas depois
  }));

 // usuário + rota
  currentUserName.value = meResponse.name ?? "";
  // depende de como o backend devolve a rota
  currentRouteName.value =
    meResponse.rotaNome ??
    meResponse.rota_nome ??
    meResponse.rota?.nome ??
    "";


  tituloPedido.value = `Pedido / ${currentUserName.value || 'Usuário'} / ${currentRouteName.value || 'Rota'}`;
  console.log("Volantes adaptados para front:", volantes.value);
});

// Volantes filtrados pela marca selecionada
const volantesFiltrados = computed(() =>
  volantes.value.filter((v) => v.marcaId === selectedMarcaId.value)
);

function voltar() {
  window.location.href = "/ev-volantes/client";
}



// Agrupa itens por marca
const itensAgrupados = computed(() => {
  const grupos: Record<string, any> = {};

  itens.value.forEach((it) => {
    if (!grupos[it.marcaId]) {
      grupos[it.marcaId] = {
        marcaNome: it.marcaNome,
        itens: [],
      };
    }
    grupos[it.marcaId].itens.push(it);
  });

  return grupos;
});



function removerItemPorId(id: string) {
  itens.value = itens.value.filter((i) => i.volanteId !== id);
}


/**
 * Etapa 1: começar fluxo de adicionar item
 */
function iniciarAdicionarItem() {
  if (!marcas.value.length) {
    alert("Nenhuma marca cadastrada para este cliente.");
    return;
  }
  uiStep.value = "marcas";
}

/**
 * Etapa 2: selecionar uma marca
 */
function selecionarMarca(marcaId: string) {
  selectedMarcaId.value = marcaId;
  quantidadesSelecionadas.value = {};

  const filtrados = volantes.value.filter((v) => v.marcaId === marcaId);

  if (!filtrados.length) {
    alert("Não há modelos cadastrados para essa marca.");
    return;
  }

  // Inicializa quantidades com 0 para cada modelo da marca
  filtrados.forEach((v) => {
    quantidadesSelecionadas.value[v.id] = 0;
  });

  uiStep.value = "modelos";
}

/**
 * Voltar da tela de marcas para estado inicial
 */
function cancelarSelecaoMarca() {
  selectedMarcaId.value = "";
  quantidadesSelecionadas.value = {};
  uiStep.value = "idle";
}

/**
 * Voltar da tela de modelos para a lista de marcas
 */
function cancelarSelecaoModelos() {
  selectedMarcaId.value = "";
  quantidadesSelecionadas.value = {};
  uiStep.value = "marcas";
}

/**
 * Confirmar modelos selecionados (com quantidade > 0)
 * e adicioná-los à lista de itens do pedido
 */
function confirmarModelos() {
  if (!selectedMarcaId.value) {
    alert("Selecione uma marca antes de confirmar.");
    return;
  }

  const marca = marcas.value.find((m) => m.id === selectedMarcaId.value);
  if (!marca) {
    alert("Marca inválida.");
    return;
  }

  const filtrados = volantes.value.filter(
    (v) => v.marcaId === selectedMarcaId.value
  );

  let adicionouAlgum = false;

  filtrados.forEach((volante) => {
    const qtd = quantidadesSelecionadas.value[volante.id] || 0;
    if (qtd > 0) {
      adicionouAlgum = true;

      // Verifica se já existe esse volante na lista
      const existente = itens.value.find(
        (item) => item.volanteId === volante.id
      );

      if (existente) {
        existente.quantidade += qtd;
      } else {
        itens.value.push({
          marcaId: marca.id,
          marcaNome: marca.nome,
          volanteId: volante.id,
          codigo: volante.codigo,
          descricao: volante.descricao,
          quantidade: qtd,
        });
      }
    }
  });

  if (!adicionouAlgum) {
    alert("Informe a quantidade para pelo menos um modelo.");
    return;
  }

  // Limpa estado e volta para tela "idle"
  selectedMarcaId.value = "";
  quantidadesSelecionadas.value = {};
  uiStep.value = "idle";
}

/**
 * Remover item da lista
 */
function removerItem(index: number) {
  itens.value.splice(index, 1);
}

/**
 * Criar pedido
 */
async function criar() {
  if (!itens.value.length) {
    alert("Adicione pelo menos um modelo ao pedido.");
    return;
  }

  // Se não preencher título, gera um padrão
  if (!tituloPedido.value) {
    tituloPedido.value = "Pedido EV Volantes";
  }

  const payload = {
    title: tituloPedido.value,
    description: observacoesPedido.value,
    items: itens.value.map((item) => ({
      volanteId: item.volanteId,
      quantidade: item.quantidade,
    })),
  };

  console.log("Payload do front:", payload);

  await apiPost("/orders", token, payload);

  window.location.href = "/ev-volantes/client";
}
</script>
<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  margin: 6px 0 12px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

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

h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

h3 {
  font-size: 18px;
  margin: 16px 0 8px 0;
}

h4 {
  font-size: 16px;
  margin-bottom: 8px;
}

.divider {
  margin: 16px 0;
  border: none;
  border-top: 1px solid #eee;
}

/* Card do fluxo de adicionar item */
.card-add-item {
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 16px;
  background: #fafafa;
}

/* Mensagens de etapa */
.mensagem-passos {
  font-size: 14px;
  margin-bottom: 8px;
}

/* Grid de marcas (botões) */
.marcas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.btn-marca {
  flex: 1 1 45%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #5e72a8;
  background: #ffffff;
  color: #5e72a8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-marca:hover {
  background: #eef1ff;
}

/* Lista de modelos */
.modelos-lista {
  max-height: 260px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.modelo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.modelo-info {
  flex: 1;
  margin-right: 8px;
}

.modelo-codigo {
  font-weight: 600;
  font-size: 14px;
}

.modelo-descricao {
  font-size: 13px;
  color: #555;
}

.input-qtd {
  width: 70px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Ações na etapa de modelos */
.acoes-modelos {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

/* Lista de itens adicionados */
.itens-lista {
  margin-bottom: 16px;
}

.item-card {
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 8px;
  background: #fff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-marca {
  font-weight: 600;
  color: #5e72a8;
}

.item-body {
  font-size: 14px;
}

.item-linha {
  margin-bottom: 2px;
}

/* Botões genéricos */
.btn-outline {
  background: transparent;
  border: 1px dashed #5e72a8;
  color: #5e72a8;
  padding: 8px;
  width: 100%;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 4px;
}

.btn-outline:hover {
  background: #eef1ff;
}

.btn-secundario {
  background: #e0e0e0;
  border: none;
  color: #424242;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 4px;
}

.btn-secundario:hover {
  background: #d5d5d5;
}

.btn-remover {
  background: transparent;
  border: none;
  color: #e53935;
  font-size: 12px;
  cursor: pointer;
}

.btn-enviar {
  background: #5e72a8;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  margin-top: 8px;
}

.btn-enviar:hover {
  background: #4b5b8a;
}

/* ========== STEPPER ( + / - ) ========== */

.stepper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  width: 110px; /* compacto */
  border-radius: 8px;
  background: #fff;
}

.stepper-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f0f0f0;
  font-size: 20px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 0 0 6px; /* ajustado via CSS */
  transition: 0.15s ease;
}

.stepper-btn:last-child {
  border-radius: 0 6px 6px 0;
}

.stepper-btn:hover {
  background: #e4e4e4;
}

.stepper-input {
  width: 40px;
  text-align: center;
  border: none;
  font-size: 14px;
  padding: 0;
  outline: none;
  background: transparent;
}

/* =============================== */
/* GRUPOS DE MARCA NA LISTAGEM    */
/* =============================== */

.grupo-marca {
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #ffffff;
  animation: fadeItem 0.3s ease;
}

.grupo-titulo {
  font-size: 15px;
  font-weight: 700;
  color: #5e72a8;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

/* Item dentro do grupo */
.grupo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f2f2f2;
}

.grupo-item:last-child {
  border-bottom: none;
}

.grupo-item-info {
  flex: 1;
  margin-right: 10px;
}

.grupo-item-codigo {
  font-size: 13px;
  font-weight: 600;
}

.grupo-item-descricao {
  font-size: 12px;
  color: #666;
}

/* Quantidade + botão remover */
.grupo-item-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.grupo-item-qtd {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.grupo-item-remove {
  background: #ffe4e4;
  border: none;
  color: #c62828;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;

  display: flex;               
  align-items: center;         
  justify-content: center;     

  line-height: 0;             
  padding: 0;                  
}

.grupo-item-remove:hover {
  background: #ffcccc;
}
</style>