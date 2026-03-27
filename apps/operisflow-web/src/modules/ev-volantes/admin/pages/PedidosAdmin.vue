<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { apiGet, apiPatch } from "../../api/apiClient";

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
  description: string;
  status: string;
  createdAt: string;
  numeroPedido?: number;
  clientName?: string;
  items: PedidoItem[];
};

const token: string = localStorage.getItem("token") ?? "";

// lista completa vinda da API
const pedidos = ref<Pedido[]>([]);

// filtros
const statusFilter = ref<string>(""); // "" = todos
const searchTerm = ref<string>("");

// pedidos filtrados
const filteredPedidos = computed(() => {
  return pedidos.value.filter((p) => {
    if (statusFilter.value && p.status !== statusFilter.value) {
      return false;
    }

    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase();

      const fields = [
        p.numeroPedido ?? "",
        p.title ?? "",
        p.description ?? "",
        p.clientName ?? "",
        ...p.items.map((i) => i.codigo ?? ""),
        ...p.items.map((i) => i.descricao ?? ""),
        ...p.items.map((i) => i.marcaNome ?? ""),
        ...p.items.map((i) => String(i.quantidade)),
      ]
        .join(" ")
        .toLowerCase();

      if (!fields.includes(term)) return false;
    }

    return true;
  });
});

async function loadPedidos() {
  pedidos.value = await apiGet("/orders", token);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/admin";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("pt-BR");
}

/**
 * FINALIZAR PEDIDO
 */

async function finalizarPedido(pedidoId: string) {
  const confirmar = confirm("Deseja realmente finalizar este pedido?");
  if (!confirmar) return;

  try {

    const payload = {
       status: "Finalizado"
    };

    await apiPatch(
      `/orders/${pedidoId}`,
      token, payload
    );

    // atualiza status local
    const pedido = pedidos.value.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.status = "Finalizado";
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao finalizar o pedido.");
  }
}


// export CSV (igual você já tem)
function exportPedidosToCsv() {
  const data = filteredPedidos.value.length
    ? filteredPedidos.value
    : pedidos.value;

  if (!data.length) return;

  const headers = [
    "Nº Pedido",
    "Rota",
    "Cliente",
    "Código",
    "Descrição",
    "Marca",
    "Quantidade",
    "Status",
    "Criado em",
    "Observações",
  ];

  const rows: string[][] = [];

  data.forEach((pedido) => {
    pedido.items.forEach((item) => {
      rows.push([
        String(pedido.numeroPedido ?? ""),
        pedido.title ?? "",
        pedido.clientName ?? "",
        item.codigo ?? "",
        item.descricao ?? "",
        item.marcaNome ?? "",
        String(item.quantidade ?? ""),
        pedido.status ?? "",
        formatDate(pedido.createdAt),
        pedido.description ?? "",
      ]);
    });
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "pedidos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

onMounted(loadPedidos);
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
        <button class="btn-secondary" @click="exportPedidosToCsv">
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

    <h2>Pedidos (Admin)</h2>

    <!-- FILTROS -->
    <div class="filters">
      <div class="filter-group">
        <label>Busca</label>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="quantidade, código ou descrição..."
        />
      </div>
    </div>

    <!-- TABELA -->
    <div class="table-container" v-if="filteredPedidos.length">
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Rota</th>
            <th>Código</th>
            <th>Descrição</th>
            <th>Observação</th>
            <th>Qtd</th>
            <th>Status</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="pedido in filteredPedidos" :key="pedido.id">
            <td>{{ pedido.numeroPedido ?? "-" }}</td>
            <td>{{ pedido.title }}</td>

            <td>
              <div v-for="item in pedido.items" :key="item.volanteId">
                <strong>{{ item.codigo }}</strong>
                <span> ({{ item.marcaNome }})</span>
              </div>
            </td>

            <td>
              <div v-for="item in pedido.items" :key="item.volanteId">
                {{ item.descricao }}
              </div>
            </td>

            <td>{{ pedido.description || "-" }}</td>

            <td>
              <div v-for="item in pedido.items" :key="item.volanteId">
                {{ item.quantidade }}
              </div>
            </td>

            <td>
              <span class="badge">{{ pedido.status }}</span>
            </td>

            <td>{{ formatDate(pedido.createdAt) }}</td>

            <!-- AÇÕES -->
            <td>
              <button
                v-if="pedido.status === 'aberto'"
                class="btn-finalizar"
                @click="finalizarPedido(pedido.id)"
              >
                Finalizar
              </button>

              <span v-else class="acao-desabilitada">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      Nenhum pedido encontrado com os filtros atuais.
    </div>
  </div>
</template>

<style scoped>

/* =========================
   CONTAINER / LAYOUT
   ========================= */
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
    min-width: 900px;
  }

  th,
  td {
    padding: 12px 14px;
  }
}

h2 {
  margin-bottom: 16px;
}

/* =========================
   TOP BAR
   ========================= */
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

.top-actions {
  display: flex;
  gap: 8px;
}

/* =========================
   BOTÕES
   ========================= */
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

/* =========================
   FILTROS
   ========================= */
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
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* =========================
   TABELA
   ========================= */
.table-container {
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
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
  font-weight: 600;
  color: #555;
}

tbody tr:hover {
  background: #fafafa;
}

/* =========================
   LISTAS DENTRO DA TABELA
   ========================= */
.pedido-codigo-lista {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pedido-codigo-lista strong {
  font-size: 13px;
}

.pedido-codigo-lista span {
  font-size: 12px;
  color: #666;
}

/* =========================
   STATUS
   ========================= */
.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

/* =========================
   AÇÕES
   ========================= */
.btn-finalizar {
  background: #2e7d32;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.btn-finalizar:hover {
  background: #1b5e20;
}

.acao-desabilitada {
  color: #aaa;
  font-size: 13px;
  text-align: center;
}

/* =========================
   ESTADO VAZIO
   ========================= */
.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}

/* =========================
   MOBILE
   ========================= */
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
</style>