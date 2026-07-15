<template>
   <div class="page">
      <div class="container">
    <!-- HEADER COM LOGO E VOLTAR -->
    <div class="top-bar">
            <button class="btn-back-mobile" @click="voltar">
              ←
            </button>

            <img src="../../../../assets/ev_volantes_image.png"
              alt="EV Volantes"
              class="logo"
            />

            <button class="btn-secondary btn-small desktop-only" @click="voltar">
              Voltar
            </button>
    </div>

    <h2>Novo Pedido</h2>

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

    <div v-if="tipoPedido" class="tipo-pedido-box">
      Tipo do pedido:
      <strong>
        {{ tipoPedido === 'remanufaturado' ? 'Remanufaturado' : 'Esportivos / Acessórios' }}
      </strong>
    </div>

    <!-- Fluxo de adicionar item -->
    <div class="card-add-item">
      <!-- Etapa idle: só botão adicionar -->
      <button
          v-if="uiStep === 'idle'"
          class="btn-outline"
          @click="iniciarAdicaoItem"
        >
          + Adicionar item
        </button>

      <!-- Etapa tipos -->
      <div v-else-if="uiStep === 'tipos'">
        <p class="mensagem-passos">Escolha o tipo de item:</p>

        <div class="marcas-grid">
          <button
            v-if="!tipoPedido || tipoPedido === 'remanufaturado'"
            class="btn-marca"
            @click="selecionarTipo('volante')"
          >
            Volantes Remanufaturados
          </button>

          <button 
            v-if="!tipoPedido || tipoPedido === 'esportivo'"
            class="btn-marca"
            @click="selecionarTipo('esportivo')"
          >
            Esportivos / Acessórios
          </button>
        </div>

        <button class="btn-secundario" @click="uiStep = 'idle'">
          Voltar
        </button>
      </div>

      <!-- Etapa marcas: mostra as marcas como botões -->
      <div v-else-if="uiStep === 'marcas'">
        <p class="mensagem-passos">Escolha uma marca:</p>
        <div class="marcas-grid">
          <button
            v-for="marca in marcasFiltradas"
            :key="marca.id"
            class="btn-marca"
            @click="selecionarMarca(marca.id)"
          >
          <img 
            :src="logoMarcas[marca.nome]" 
            alt="logo" 
            class="marca-logo"
          />
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
          
            <div class="div_image"><img :src="volante.img" :alt="volante.codigo" /></div>
                    
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

      <div
        v-for="(grupo, marcaId) in itensAgrupados"
        :key="marcaId"
        class="grupo-marca"
      >
        <div class="grupo-titulo">
          <img 
            :src="logoMarcas[grupo.marcaNome]" 
            alt="logo" 
            class="marca-logo"
          />
          <span>{{ grupo.marcaNome }}</span>
        </div>

        
            <div
              class="grupo-item"
              v-for="it in grupo.itens"
              :key="it.volanteId"
            >

          <div class="grupo-item-info">
            <div class="grupo-item-codigo">{{ it.codigo }}  <div class="grupo-item-descricao">{{ it.descricao }}</div> </div>
          </div>

          <div class="grupo-item-acoes">
            <span class="grupo-item-qtd">Qtde {{ it.quantidade }} </span>
            <button
              class="grupo-item-remove"
              @click="removerItemPorId(it.volanteId)"
            > ✕ </button>
          </div>
        </div>
      </div>
    </div>

    <button @click="criar" class="btn-enviar" v-if="uiStep === 'idle'">
      Enviar Pedido
    </button>
  </div>
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
  img: string;
  marcaId: string;       
  marcaNome?: string;
  tipo: string;      
};

type ItemPedido = {
  marcaId: string;
  marcaNome: string;
  volanteId: string;
  codigo: string;
  descricao: string;
  quantidade: number;
};

const logoMarcas: Record<string, string> = {
  "Chevrolet": "/marcas/chevrolet.png",
  "Fiat": "/marcas/fiat.png",
  "Ford": "/marcas/ford.png",
  "Renault": "/marcas/renault.png",
  "Volkswagen": "/marcas/volkswagen.png",
  "Hyundai": "/marcas/hyundai.png",
  "Mercedes-Benz": "/marcas/mercedes.png",
};

type UIStep = "idle" | "tipos" | "marcas" | "modelos";

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

type TipoVolante = "volante" | "esportivo" | "acessorio";
const tipoPedido = ref<"remanufaturado" | "esportivo" | null>(null);

const tipoSelecionado = ref<TipoVolante | null>(null);

// Carrega marcas e volantes ao montar a tela
onMounted(async () => {
  const [marcasResponse, volantesResponse, meResponse] = await Promise.all([
    apiGet("/marcas"),
    apiGet("/volantes"),
    apiGet("/auth/me"), 

  ]);

  marcas.value = marcasResponse;

  // Adaptar campos snake_case -> camelCase
  volantes.value = volantesResponse.map((v: any) => ({
    id: v.id,
    codigo: v.codigo,
    descricao: v.descricao,
    img: v.img,
    marcaId: v.marca_id ?? v.marcaId,       
    marcaNome: v.marca_nome ?? v.marcaNome, 
    tipo: v.tipo,
  }));

 // usuário + rota
  currentUserName.value = meResponse.name ?? "";
  // depende de como o backend devolve a rota
  currentRouteName.value =
    meResponse.rotaNome ??
    meResponse.rota_nome ??
    meResponse.rota?.nome ??
    "";


  tituloPedido.value = `${currentUserName.value || 'Usuário'} / ${currentRouteName.value || 'Rota'}`;
  console.log("Volantes adaptados para front:", volantes.value);
});

// Volantes filtrados pela marca selecionada
const volantesFiltrados = computed(() =>
  volantes.value.filter((v) => {
    if (tipoPedido.value === "remanufaturado") {
      return v.marcaId === selectedMarcaId.value && v.tipo === "volante";
    }

    if (tipoPedido.value === "esportivo") {
      return v.marcaId === selectedMarcaId.value &&
        (v.tipo === "esportivo" || v.tipo === "acessorio");
    }

    return false;
  })
);

function voltar() {
  window.location.href = "/ev-volantes/client";
}

function iniciarAdicaoItem() {

  // 👉 se já tem tipo definido → pula direto
  if (tipoPedido.value) {

    // define tipoSelecionado automático
    if (tipoPedido.value === "remanufaturado") {
      tipoSelecionado.value = "volante";
    } else {
      // aqui você pode escolher estratégia (explico abaixo)
      tipoSelecionado.value = "esportivo";
    }

    uiStep.value = "marcas";
    return;
  }

  // fluxo normal
  uiStep.value = "tipos";
}

function selecionarTipo(tipo: TipoVolante) {

  if (!tipoPedido.value) {
    tipoPedido.value = tipo === "volante" ? "remanufaturado" : "esportivo";
  }

  // continua usando normalmente
  tipoSelecionado.value = tipo;
  uiStep.value = "marcas";
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

const marcasFiltradas = computed(() => {
  if (!tipoSelecionado.value) return [];

  const marcasValidas = new Set(
    volantes.value
      .filter(v => v.tipo === tipoSelecionado.value)
      .map(v => v.marcaId)
  );

  return marcas.value.filter(m => marcasValidas.has(m.id));
});



function removerItemPorId(id: string) {
  itens.value = itens.value.filter((i) => i.volanteId !== id);

  // ✅ libera o tipo novamente
  if (itens.value.length === 0) {
    tipoPedido.value = null;
  }
}


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
  uiStep.value = "tipos";
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

    const tipos = new Set(
      itens.value.map((i) => {
        const v = volantes.value.find(v => v.id === i.volanteId);
        return v?.tipo;
      })
    );

    const temVolante = tipos.has("volante");
    const temOutros = tipos.has("esportivo") || tipos.has("acessorio");

    if (temVolante && temOutros) {
      alert("Não é permitido misturar remanufaturados com esportivos/acessórios.");
      return;
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

  await apiPost("/orders", payload);

  window.location.href = "/ev-volantes/client";
}
</script>




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
  max-width: 1000px;

  padding: 32px;

  border-radius: 24px;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);
}

body {
  background:
    linear-gradient(
      135deg,
      #111111,
      #171717,
      #0d0d0d
    );
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

  margin-bottom: 24px;
}

.logo {
  height: 55px;

  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
}

.btn-logout {
  background: transparent;

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 10px 16px;

  border-radius: 10px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-logout:hover {
  background: rgba(0,75,255,.12);

  color: white;
}

h2 {
  text-align: center;

  color: white;

  font-size: 2rem;

  margin-bottom: 24px;
}

h3,
h4 {
  color: white;
}

.divider {
  margin: 16px 0;
  border: none;
  border-top: 1px solid #eee;
}

.marcas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;               
  margin-bottom: 10px;
}

.btn-marca {
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px;
  border-radius: 14px;

  border: 1px solid rgba(0, 75, 255, .35);

  background: rgba(255,255,255,.03);
  backdrop-filter: blur(10px);

  color: white;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: all .25s ease;
}

.btn-marca:hover {
  transform: translateY(-2px);

  border-color: #004BFF;

  background: rgba(0,75,255,.12);

  box-shadow:
    0 0 0 1px rgba(0,75,255,.3),
    0 8px 25px rgba(0,75,255,.25);
}


.marca-logo {
  width: 26px;           
  height: 26px;
  object-fit: contain;
  display: block;
}

.mensagem-passos {
  font-size: 14px;
  margin-bottom: 6px;       
}

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

.acoes-modelos {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.acoes-modelos .btn-outline {
  border: none;

  background: linear-gradient(
    135deg,
    #004BFF,
    #2563eb
  );

  color: white;

  font-weight: 700;
}

.acoes-modelos .btn-outline:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 30px rgba(0,75,255,.35);
}

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

.btn-outline {
  width: 100%;

  padding: 14px;

  border-radius: 14px;

  border: 1px dashed rgba(0,75,255,.5);

  background: rgba(255,255,255,.03);

  color: #4d7cff;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: all .25s ease;
}

.btn-outline:hover {
  background: rgba(0,75,255,.12);

  border-color: #004BFF;

  color: white;

  box-shadow:
    0 8px 25px rgba(0,75,255,.2);
}

.btn-secundario {
  background: rgba(255,255,255,.05);

  border: 1px solid rgba(255,255,255,.08);

  color: #cbd5e1;

  padding: 12px;

  border-radius: 12px;

  font-weight: 600;

  cursor: pointer;

  transition: all .25s ease;
}

.btn-secundario:hover {
  background: rgba(255,255,255,.08);

  border-color: rgba(255,255,255,.15);

  color: white;
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

.stepper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  width: 110px; 
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
  border-radius: 6px 0 0 6px;
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

.grupo-marca {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  backdrop-filter: blur(10px);
}

.grupo-titulo {
  display: flex;
  align-items: center;     
  gap: 10px;                
  font-size: 15px;
  font-weight: 700;
  color: #5e72a8;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
}

.marca-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: block;           
  margin: 0;
  padding: 0;
  vertical-align: middle;   
}

.grupo-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.grupo-item-codigo {
  color: white;
}

.grupo-item-descricao {
  color: #94a3b8;
}

.grupo-item-qtd {
  color: #4d7cff;
}

.grupo-item:last-child {
  border-bottom: none;
}

.grupo-item-info {
  flex: 1;
  margin-right: 10px;
}

.grupo-item-descricao {
  font-size: 12px;
  color: #666;
}

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

.div_image {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;        
  border-radius: 6px;
  background: #fff;       
  flex-shrink: 0;     
  margin-right: 15px;     
}

.div_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;    /* ou cover → depende do estilo */
  display: block;
}

.tipo-pedido-box {
  background: #eef1ff;
  border: 1px solid #5e72a8;
  padding: 8px;
  border-radius: 8px;
  margin: 8px 0 12px;
  font-size: 13px;
}

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

label {
  display: block;

  margin-bottom: 6px;

  color: #cbd5e1;

  font-weight: 600;
}

.input {
  width: 100%;

  padding: 12px 14px;

  margin-top: 6px;
  margin-bottom: 16px;

  border-radius: 12px;

  border: 1px solid rgba(255,255,255,.08);

  background: rgba(255,255,255,.03);

  color: white;

  font-size: 14px;

  transition: .25s;
}

.input:focus {
  outline: none;

  border-color: #004BFF;

  box-shadow:
    0 0 0 4px rgba(0,75,255,.15);
}
</style>