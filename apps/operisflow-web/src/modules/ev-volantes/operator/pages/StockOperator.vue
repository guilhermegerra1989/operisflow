<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { apiGet } from "../../api/apiClient";

type PedidoItem = {
  volanteId: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  marcaNome?: string;
};

type Pedido = {
  id: string;
  title: string;        // rota (usada só para filtro)
  description: string;
  status: string;
  createdAt: string;
  numeroPedido?: number;
  clientName?: string;
  items: PedidoItem[];
};

type EstoqueRow = {
  volanteId: string;
  codigo: string;
  descricao: string;
  marcaNome?: string;
  quantidadeTotal: number; // soma da quantidade em pedidos abertos
};

const token: string = localStorage.getItem("token") ?? "";

// =======================
// DADOS
// =======================
const pedidos = ref<Pedido[]>([]);

// =======================
// FILTROS
// =======================
const searchTerm = ref<string>("");

// multi filtro de rotas
const rotasSelecionadas = ref<string[]>([]);

// UI do multiselect de rotas
const rotaSearch = ref<string>("");
const rotaDropdownOpen = ref<boolean>(false);

// =======================
// INPUTS DE ESTOQUE (por linha)
// =======================
const estoqueInputMap = ref<Record<string, string>>({});

function rowKey(row: EstoqueRow): string {
  return row.volanteId;
}

/**
 * Aceita apenas número decimal positivo:
 * - vazio => null
 * - permite vírgula ou ponto
 * - bloqueia negativos e NaN
 */
function parseEstoqueValue(raw: string | undefined): number | null {
  if (!raw) return null;

  const cleaned = raw.replace(",", ".").trim();
  if (!cleaned) return null;

  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  if (n < 0) return null;

  return n;
}

/**
 * Injetar = max(0, pedido - estoque)
 * Só calcula se estoque for válido/preenchido.
 */
function calcInjetar(row: EstoqueRow): number | null {
  const key = rowKey(row);
  const estoqueNum = parseEstoqueValue(estoqueInputMap.value[key]);
  if (estoqueNum === null) return null;

  const pedido = row.quantidadeTotal ?? 0;
  return Math.max(0, pedido - estoqueNum);
}

function limparQtdeEstoque() {
  estoqueInputMap.value = {}; // limpa todos os campos de estoque
}

/**
 * Sanitiza o input no momento da digitação:
 * - mantém apenas dígitos e 1 separador decimal (.)
 * - troca vírgula por ponto
 * - remove sinal negativo
 * - remove zeros inúteis à esquerda (sem quebrar "0.x")
 *
 * Obs: ainda permite o usuário digitar "12." temporariamente.
 */
function sanitizeDecimalPositiveInput(value: string): string {
  if (!value) return "";

  // troca vírgula por ponto
  let v = value.replace(/,/g, ".");

  // remove tudo que não seja número ou ponto
  v = v.replace(/[^\d.]/g, "");

  // garante apenas um ponto
  const parts = v.split(".");
  if (parts.length > 2) {
    v = parts[0] + "." + parts.slice(1).join("");
  }

  // evita "00012" -> "12" (mas mantém "0." e "0.x")
  // se começa com vários zeros e não tem ponto logo após:
  if (/^0+\d/.test(v) && !/^0\./.test(v)) {
    v = v.replace(/^0+/, "");
    if (v === "") v = "0";
  }

  // se o usuário digitar só ".", vira "0."
  if (v === ".") v = "0.";

  return v;
}

function setEstoqueValue(row: EstoqueRow, raw: string) {
  const key = rowKey(row);
  estoqueInputMap.value[key] = sanitizeDecimalPositiveInput(raw);
}

// =======================
// LOAD
// =======================
async function loadPedidos() {
  pedidos.value = await apiGet("/orders", token);
}

// =======================
// ROTAS (para filtro)
// =======================
const rotaOptions = computed(() => {
  const set = new Set<string>();
  pedidos.value.forEach((p) => {
    if (p.title) set.add(p.title);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const rotaOptionsFiltered = computed(() => {
  const term = rotaSearch.value.trim().toLowerCase();
  if (!term) return rotaOptions.value;
  return rotaOptions.value.filter((r) => r.toLowerCase().includes(term));
});

const todasRotasSelecionadas = computed(() => {
  const total = rotaOptions.value.length;
  return total > 0 && rotasSelecionadas.value.length === total;
});

function toggleTodasRotas() {
  if (todasRotasSelecionadas.value) {
    rotasSelecionadas.value = [];
  } else {
    rotasSelecionadas.value = [...rotaOptions.value];
  }
}

function toggleRota(rota: string) {
  const idx = rotasSelecionadas.value.indexOf(rota);
  if (idx >= 0) rotasSelecionadas.value.splice(idx, 1);
  else rotasSelecionadas.value.push(rota);
}

function limparRotas() {
  rotasSelecionadas.value = [];
}

function abrirFecharDropdown() {
  rotaDropdownOpen.value = !rotaDropdownOpen.value;
}


// fecha ao clicar fora
function onClickOutsideRoutes(e: MouseEvent) {
  const el = document.getElementById("route-multiselect");
  if (!el) return;
  if (!el.contains(e.target as Node)) {
    rotaDropdownOpen.value = false;
  }
}

// =======================
// PEDIDOS EM ABERTO
// =======================
const pedidosAbertos = computed(() => {
  return pedidos.value.filter((p) => p.status === "aberto");
});

// =======================
// ESTOQUE (somatória por VOLANTE)
// =======================
const estoqueRows = computed<EstoqueRow[]>(() => {
  const map = new Map<string, EstoqueRow>();

  pedidosAbertos.value.forEach((pedido) => {
    const rota = pedido.title || "";

    // filtro por rotas selecionadas:
    // se não tem nenhuma selecionada -> "todas"
    if (rotasSelecionadas.value.length > 0 && !rotasSelecionadas.value.includes(rota)) {
      return;
    }

    pedido.items.forEach((item) => {
      const key = item.volanteId;

      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          volanteId: item.volanteId,
          codigo: item.codigo,
          descricao: item.descricao,
          marcaNome: item.marcaNome,
          quantidadeTotal: item.quantidade ?? 0,
        });
      } else {
        existing.quantidadeTotal += item.quantidade ?? 0;
      }
    });
  });

  let result = Array.from(map.values());

  // busca geral
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter((row) => {
      const fields = [
        row.codigo ?? "",
        row.descricao ?? "",
        row.marcaNome ?? "",
        String(row.quantidadeTotal ?? 0),
        estoqueInputMap.value[row.volanteId] ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return fields.includes(term);
    });
  }

  // ordenar por código
  result.sort((a, b) => (a.codigo || "").localeCompare(b.codigo || ""));

  return result;
});

// =======================
// UTIL
// =======================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/admin";
}

function formatNumber(n: number): string {
  return (n ?? 0).toLocaleString("pt-BR");
}

function exportEstoqueToCsv() {
  const data = estoqueRows.value;
  if (!data.length) return;

  const headers = [
    "Código",
    "Descrição",
    "Marca",
    "Qtd Pedidos (abertos)",
    "Qtd Estoque",
    "Injetar",
  ];

  const rows: string[][] = data.map((row) => {
    const key = rowKey(row);

    const estoqueRaw = estoqueInputMap.value[key];
    const estoqueNum = parseEstoqueValue(estoqueRaw);

    // regra: se vazio/ inválido -> mantém vazio no CSV
    if (estoqueNum === null) {
      return [
        row.codigo ?? "",
        row.descricao ?? "",
        row.marcaNome ?? "",
        String(row.quantidadeTotal ?? 0),
        "",
        "",
      ];
    }

    const injetarNum = Math.max(0, (row.quantidadeTotal ?? 0) - estoqueNum);

    return [
      row.codigo ?? "",
      row.descricao ?? "",
      row.marcaNome ?? "",
      String(row.quantidadeTotal ?? 0),
      String(estoqueNum),
      String(injetarNum),
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "estoque_pedidos_abertos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// =======================
// LIFECYCLE
// =======================
onMounted(() => {
  loadPedidos();
  window.addEventListener("click", onClickOutsideRoutes);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutsideRoutes);
});
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

      <div class="top-actions">
        <button class="btn-secondary" @click="exportEstoqueToCsv">
          Exportar
        </button>
        <button class="btn-secondary" @click="voltarDashboard">
          Dashboard
        </button>
        <button class="btn-logout" @click="logout">
          Sair
        </button>
      </div>
    </div>

    <h2>Estoque - Pedidos em Aberto</h2>

    <!-- FILTROS -->
    <div class="filters">
      <div class="filter-group">
        <label>Busca Geral</label>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="código, descrição, marca, quantidade..."
        />
      </div>

      <div class="filter-group">
        <label>Rotas</label>

        <div id="route-multiselect" class="route-multiselect">
          <div
            class="route-input"
            :class="{ open: rotaDropdownOpen }"
            @click.stop="abrirFecharDropdown"
          >
            <div class="chips">
              <template v-if="rotasSelecionadas.length">
                <span class="chips-placeholder">
                  {{ todasRotasSelecionadas
                    ? "Todas as rotas"
                    : rotasSelecionadas.length + " rota(s) selecionada(s)" }}
                </span>
              </template>

              <span v-else class="chips-placeholder">Todas as rotas</span>
            </div>

            <div class="route-input-actions">
              <button
                v-if="rotasSelecionadas.length"
                class="icon-btn"
                title="Limpar seleção"
                @click.stop="limparRotas"
              >
                ✕
              </button>
              <span class="caret">▾</span>
            </div>
          </div>

          <div v-if="rotaDropdownOpen" class="route-dropdown" @click.stop>
            <div class="route-dropdown-top">
              <input
                v-model="rotaSearch"
                class="route-search"
                type="text"
                placeholder="Buscar rota..."
              />
            </div>

            <div class="route-options">
              <label class="route-option option-all">
                <input
                  type="checkbox"
                  :checked="todasRotasSelecionadas"
                  @change.stop="toggleTodasRotas"
                />
                <span class="check-ui"></span>
                <span class="route-text">Todas</span>
              </label>

              <div class="divider"></div>

              <label
                v-for="rota in rotaOptionsFiltered"
                :key="rota"
                class="route-option"
              >
                <input
                  type="checkbox"
                  :checked="rotasSelecionadas.includes(rota)"
                  @change.stop="toggleRota(rota)"
                />
                <span class="check-ui"></span>
                <span class="route-text">{{ rota }}</span>
              </label>

              <div v-if="!rotaOptionsFiltered.length" class="no-results">
                Nenhuma rota encontrada.
              </div>
            </div>

            <div class="route-dropdown-footer">
              <span class="selected-count">
                {{ rotasSelecionadas.length
                  ? rotasSelecionadas.length + " selecionada(s)"
                  : "Todas selecionadas" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label>Estoque</label>
        
        <button class="btn-secondary btn-clear" @click="limparQtdeEstoque">
            Limpar Qtde Estoque
          </button>

      </div>
    </div>

    <!-- TABELA -->
    <div class="table-container" v-if="estoqueRows.length">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Marca</th>
            <th>Qtde Pedido (aberto)</th>
            <th>Qtde Estoque</th>
            <th>Injetar</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in estoqueRows" :key="row.volanteId">
            <td>{{ row.codigo }}</td>
            <td>{{ row.descricao }}</td>
            <td>{{ row.marcaNome || "-" }}</td>
            <td><strong>{{ formatNumber(row.quantidadeTotal) }}</strong></td>

            <td class="estoque-cell">
              <input
                class="estoque-input"
                type="text"
                inputmode="decimal"
                placeholder="0"
                :value="estoqueInputMap[row.volanteId] ?? ''"
                @input="setEstoqueValue(row, ($event.target as HTMLInputElement).value)"
              />
            </td>

            <td class="injetar-cell">
              <template v-if="calcInjetar(row) !== null">
                <strong>{{ formatNumber(calcInjetar(row) as number) }}</strong>
              </template>
              <template v-else>
                <span class="muted"></span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      Nenhum item encontrado com os filtros atuais.
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 16px;
  margin-right: 15px;
}

.logo {
  height: 36px;
  object-fit: contain;
}

.top-actions {
  display: flex;
  gap: 8px;
}

/* Botões */
.btn-secondary {
  background: transparent;
  border: 1px solid #0759a0;
  color: #5e72a8;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e3f2fd;
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
}

.btn-logout:hover {
  background: #ffebee;
}

h2 {
  margin-bottom: 16px;
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
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

thead {
  background: #f5f5f5;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  text-align: left;
  vertical-align: middle;
}

th {
  font-weight: 700;
  color: #555;
}

tbody tr:hover {
  background: #fafafa;
}

.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
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
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  color: #1f2937;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}

.estoque-input:hover {
  background: #f9fafb;
}

.estoque-input:focus {
  border-color: rgba(7, 89, 160, .45);
  box-shadow: 0 0 0 4px rgba(7, 89, 160, .10);
}

.injetar-cell {
  width: 120px;
}

.muted {
  color: #9ca3af;
  font-weight: 600;
}

/* ============================
   MULTISELECT ROTAS (SaaS clean)
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

/* Campo */
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
  user-select: none;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}

.route-input:hover {
  background: var(--bg-soft);
}

.route-input.open {
  border-color: rgba(7, 89, 160, .45);
  box-shadow: 0 0 0 4px rgba(7, 89, 160, .10);
  background: #fff;
}

/* Área do “valor” */
.chips {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.chips-placeholder {
  color: var(--muted);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ações à direita */
.route-input-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 8px;
  width: 30px;
  height: 30px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  color: var(--muted);
  font-weight: 900;
  transition: background .15s ease, border-color .15s ease, color .15s ease;
}

.icon-btn:hover {
  background: var(--bg-soft);
  border-color: rgba(107, 114, 128, .35);
  color: #111827;
}

.caret {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  border: 1px solid transparent;
}

/* Dropdown */
.route-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 50;

  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* Cabeçalho do dropdown */
.route-dropdown-top {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border-bottom: 1px solid var(--border);
}

.route-search {
  flex: 1;
  height: 38px;
  border-radius: 10px;
  padding: 0 12px;

  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-size: 13px;

  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.route-search:focus {
  border-color: rgba(7, 89, 160, .45);
  box-shadow: 0 0 0 4px rgba(7, 89, 160, .10);
}

/* Lista de opções */
.route-options {
  max-height: 260px;
  overflow: auto;
  padding: 8px;
}

/* scrollbar suave */
.route-options::-webkit-scrollbar {
  width: 10px;
}
.route-options::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 999px;
  border: 3px solid #fff;
}
.route-options::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Opção */
.route-option {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 10px;
  border-radius: 12px;
  cursor: pointer;

  transition: background .12s ease;
}

.route-option:hover {
  background: #f3f7ff;
}

.option-all {
  background: rgba(7, 89, 160, .04);
}
.option-all:hover {
  background: rgba(7, 89, 160, .08);
}

/* esconder checkbox nativo */
.route-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* checkbox custom */
.check-ui {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1.8px solid #cbd5e1;
  background: #fff;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: all .12s ease;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.8);
}

.route-option input[type="checkbox"]:checked + .check-ui {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-.2px);
  box-shadow: 0 6px 12px rgba(7, 89, 160, .18);
}

.route-option input[type="checkbox"]:checked + .check-ui::after {
  content: "✓";
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
}

/* Texto */
.route-text {
  color: var(--text);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: .1px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* divisor */
.divider {
  height: 1px;
  background: #eef2f7;
  margin: 8px 6px;
}

/* sem resultados */
.no-results {
  padding: 12px 10px;
  color: var(--muted);
  font-size: 13px;
}

/* Rodapé */
.route-dropdown-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: #fbfcfe;
}

.selected-count {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}
</style>
