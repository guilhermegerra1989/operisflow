<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { apiGet, apiPost, apiDelete } from "../../api/apiClient";

/* =======================
   TIPOS
======================= */
type PedidoItem = {
  volanteId: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  marcaNome?: string;
};

type Pedido = {
  id: string;
  title: string;
  tipo: string;
  status: string;
  items: PedidoItem[];
};

type EstoqueRow = {
  volanteId: string;
  codigo: string;
  descricao: string;
  marcaNome?: string;
  quantidadeTotal: number;
};

type EstoqueSalvo = {
  id: string;
  codigo: string;
  descricao: string;
  qtd_pedidos: string;
  qtd_estoque: string;
  qtd_injetar: string;
};

/* =======================
   USUÁRIO / ROLE
======================= */
const user = ref<any>(null);
const salvando = ref(false);


/* =======================
   ESTADOS
======================= */
const pedidos = ref<Pedido[]>([]);
const estoqueSalvo = ref<EstoqueSalvo[]>([]);
const estoqueInputMap = ref<Record<string, string>>({});

/* =======================
   LOADERS
======================= */
async function loadPedidos() {
  pedidos.value = await apiGet("/orders");
}

async function loadEstoqueSalvo() {
  estoqueSalvo.value = await apiGet("/estoque");

  if (estoqueSalvo.value.length) {
    estoqueInputMap.value = {};
    estoqueSalvo.value.forEach((item) => {
      estoqueInputMap.value[item.codigo] = item.qtd_estoque;
    });
  }
}

/* =======================
   COMPUTEDS
======================= */
const pedidosAbertos = computed(() =>
  pedidos.value.filter(
    (p) => p.status === "aberto" && p.tipo === "volante"
  )
);

const estoqueRows = computed<EstoqueRow[]>(() => {
  const map = new Map<string, EstoqueRow>();

  pedidosAbertos.value.forEach((pedido) => {
    pedido.items.forEach((item) => {
      const existing = map.get(item.codigo);
      if (!existing) {
        map.set(item.codigo, {
          volanteId: item.volanteId,
          codigo: item.codigo,
          descricao: item.descricao,
          marcaNome: item.marcaNome,
          quantidadeTotal: item.quantidade,
        });
      } else {
        existing.quantidadeTotal += item.quantidade;
      }
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.codigo.localeCompare(b.codigo)
  );
});

const snapshotExiste = computed(() => estoqueSalvo.value.length > 0);
const tabelaBloqueada = computed(
  () => snapshotExiste.value || salvando.value
);


/* =======================
   CÁLCULOS
======================= */
function parseNumber(raw?: string): number {
  if (!raw) return 0;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function calcInjetar(row: EstoqueRow): number {
  const estoque = parseNumber(estoqueInputMap.value[row.codigo]);
  return Math.max(0, row.quantidadeTotal - estoque);
}

/* =======================
   INPUT HANDLER (CORRETO)
======================= */
function updateEstoque(codigo: string, value: string) {
  if (tabelaBloqueada.value) return;

  const onlyNumbers = value.replace(/\D+/g, "");
  estoqueInputMap.value[codigo] =
    onlyNumbers === "" ? "" : onlyNumbers;
}

/* =======================
   AÇÕES
======================= */
async function salvarEstoque() {
  if (salvando.value) return;

  salvando.value = true;

  try {
    const agora = new Date().toISOString();

    for (const row of estoqueRows.value) {
      const qtdEstoqueRaw =
        estoqueInputMap.value[row.codigo] ?? "0";

      const dto = {
        codigo: row.codigo,
        descricao: row.descricao,
        qtd_pedidos: String(row.quantidadeTotal),
        qtd_estoque: qtdEstoqueRaw,
        qtd_injetar: String(calcInjetar(row)),
        created_at: agora,
        updated_at: agora,
      };

      await apiPost("/estoque", dto);
    }

    await loadEstoqueSalvo();
  } finally {
    salvando.value = false;
  }
}

async function limparEstoque() {
  await apiDelete("/estoque");

  estoqueSalvo.value = [];
  estoqueInputMap.value = {};

  await loadPedidos();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/operator";
}

function onFocusEstoque(codigo: string, event: FocusEvent) {
  if (tabelaBloqueada.value) return;

  const input = event.target as HTMLInputElement;

  if (estoqueInputMap.value[codigo] === "0") {
    estoqueInputMap.value[codigo] = "";

    // ✅ força o cursor e seleção (Firefox friendly)
    requestAnimationFrame(() => {
      input.value = "";
      input.setSelectionRange(0, 0);
    });
  }
}


function onBlurEstoque(codigo: string) {
  if (tabelaBloqueada.value) return;

  // Se ficou vazio, volta para zero
  if (
    estoqueInputMap.value[codigo] == null ||
    estoqueInputMap.value[codigo] === ""
  ) {
    estoqueInputMap.value[codigo] = "0";
  }
}

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user") || "null");
  await loadPedidos();
  await loadEstoqueSalvo();
});
</script>

<template>
 <div class="page">
  <div class="container">

    <div class="top-bar">
      <img
        src="../../../../assets/ev_volantes_image.png"
        alt="EV Volantes"
        class="logo"
      />
      <div class="top-actions">
        <!-- <button class="btn-secondary" @click="exportToCsv">
          Exportar
        </button> -->
        <button class="btn-secondary" @click="voltarDashboard">
          Dashboard
        </button>
        <button class="btn-logout" @click="logout">
          Sair
        </button>
      </div>
    </div>


    <h2>Estoque - Pedidos em Aberto</h2>

    <div class="table-container" v-if="estoqueRows.length">
      <div v-if="salvando" class="saving-overlay">
        Salvando estoque...
      </div>

      <table>
        <thead>
          <tr>
            <th>Cod.</th>
            <!-- <th>Descrição</th>
            <th>Marca</th> -->
            <th>Qtd Ped</th>
            <th>Qtd Est</th>
            <th>Injetar</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in estoqueRows" :key="row.codigo">
            <!-- <td>{{ row.codigo }}</td> -->
            <td>{{ row.descricao }}</td>
            <!-- <td>{{ row.marcaNome || "-" }}</td> -->
            <td><strong>{{ row.quantidadeTotal }}</strong></td>

            <td>
              <input
                class="estoque-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                :disabled="tabelaBloqueada"
                :value="estoqueInputMap[row.codigo] ?? '0'"
                @focus="onFocusEstoque(row.codigo, $event)"
                @blur="onBlurEstoque(row.codigo)"
                @input="updateEstoque(row.codigo, ($event.target as HTMLInputElement).value)"
              />
            </td>

            <td>
              <strong>{{ calcInjetar(row) }}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-actions">
        <button
          v-if="!snapshotExiste"
          class="btn-secondary"
          :disabled="salvando"
          @click="salvarEstoque"
        >
          <span v-if="salvando">Salvando...</span>
          <span v-else>Salvar</span>
        </button>

        <button
          v-if="snapshotExiste"
          class="btn-secondary"
          :disabled="salvando"
          @click="limparEstoque"
        >
          Limpar
        </button>
      </div>
    </div>

    <div v-else class="empty">
      Nenhum item encontrado.
    </div>
  </div>
  </div>
</template>


<style scoped>

.page {
  min-height: 100vh;

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
  position: relative;

  overflow: hidden;

  width: 100%;
  max-width: 1300px;

  margin: 0 auto;

  padding: 32px;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 24px;

  transition: .35s ease;

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);
}

.container::before {
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

.container:hover {

  border-color: #004BFF;

  transform: translateY(-4px);

  box-shadow:
    0 18px 45px rgba(0,75,255,.25);
}

@media (min-width: 900px) {
  .container {
    padding: 24px 32px;
    max-width: 1300px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .filters {
    gap: 20px;
  }

  .filter-group {
    min-width: 320px;
  }

  table {
    font-size: 14px;
    min-width: 980px;
  }

  th,
  td {
    padding: 12px 14px;
  }
}

/* TOPO */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 30px;
}

.logo {
  height: 60px;
  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
}

.top-actions {
  display: flex;
  gap: 8px;
}

/* Botões */
.btn-secondary {
  background: transparent;

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 8px 14px;

  border-radius: 10px;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-secondary:hover {
  background: rgba(0,75,255,.12);

  color: white;
}

.btn-logout {
  width: auto;
  min-width: unset;

  padding: 4px 10px;

  font-size: 12px;

  border-radius: 8px;

  background: transparent;

  border: 1px solid rgba(239,68,68,.35);

  color: #f87171;

  cursor: pointer;

  transition: .25s;
}

.btn-logout:hover {
  background: rgba(239,68,68,.12);

  color: white;
}

h2 {
  color: white;

  text-align: center;

  font-size: 2rem;

  margin-bottom: 32px;
}

/* FILTROS */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 320px;
}

.filter-group label {
  font-size: 13px;
  margin-bottom: 4px;
}

.filter-group input {
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.filter-group input:focus {
  border-color: rgba(7, 89, 160, .45);
  box-shadow: 0 0 0 4px rgba(7, 89, 160, .10);
}

/* TABELA */
.table-container {
  overflow-x: auto;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.08);

  border-radius: 18px;

  transition: .25s;
}

.table-container:hover {

  border-color: rgba(0,75,255,.4);

  box-shadow:
    0 10px 30px rgba(0,75,255,.15);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* desktop confortável */
}

@media (max-width: 600px) {
  table {
    min-width: 100%; /* mobile não força scroll gigante */
  }
}

thead {
  background: rgba(0,75,255,.15);
}

th,
td {
  padding: 14px;

  color: white;

  border-bottom:
    1px solid rgba(255,255,255,.05);

  font-size: 13px;
}

th {
  color: #e2e8f0;

  font-weight: 700;
}


tbody tr {
  transition: .2s;
}

tbody tr:hover {
  background: rgba(255,255,255,.03);
}

.empty {
  text-align: center;

  color: #94a3b8;

  margin-top: 24px;
}

@media (max-width: 600px) {
  th,
  td {
    padding: 6px 8px;
    font-size: 12px;
  }

  th {
    font-size: 11px;
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .container {
    padding: 12px;
  }

  h2 {
    font-size: 18px;
  }

  .filter-group {
    min-width: 100%;
  }
}

/* ============================
   INPUT QTDE ESTOQUE / INJETAR
   ============================ */
.estoque-cell {
  width: 150px;
}

.estoque-input {
  width: 120px;

  height: 36px;

  padding: 0 10px;

  border-radius: 10px;

  border: 1px solid rgba(255,255,255,.08);

  background: rgba(255,255,255,.03);

  color: white;

  outline: none;

  transition: .25s;
}

.estoque-input:focus {
  border-color: #004BFF;

  box-shadow:
    0 0 0 4px rgba(0,75,255,.15);
}

.estoque-input:hover {
  border-color: rgba(0,75,255,.35);
}

/* ✅ DESABILITADO (operador + snapshot) */
.estoque-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .estoque-input {
    width: 68px;
    height: 32px;
    font-size: 12px;
    text-align: center;
  }
}

/* Chrome, Edge */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}


.injetar-cell {
  width: 120px;
}

.muted {
  color: #9ca3af;
  font-weight: 600;
}

/* ============================
   MULTISELECT ROTAS
   ============================ */
.route-multiselect {
  position: relative;
  width: 100%;
  --primary: #0759a0;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #e5e7eb;
  --bg: #ffffff;
  --bg-soft: #f9fafb;
  --shadow: 0 12px 32px rgba(2, 8, 23, 0.14);
}

.route-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: pointer;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.route-input.open {
  border-color: rgba(7, 89, 160, .45);
  box-shadow: 0 0 0 4px rgba(7, 89, 160, .10);
}

/* ============================
   AÇÕES DA TABELA
   ============================ */
.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 16px;
}

@media (max-width: 600px) {
  .table-actions {
    width: 100%;
    justify-content: center;
  }

  .table-actions button {
    flex: 1;
    max-width: 160px;
  }
}

.saving-overlay {
  position: sticky;

  top: 0;

  background: rgba(0,75,255,.15);

  color: #60a5fa;

  padding: 12px 16px;

  font-weight: 700;

  border-bottom:
    1px solid rgba(0,75,255,.25);

  z-index: 10;
}

</style>
