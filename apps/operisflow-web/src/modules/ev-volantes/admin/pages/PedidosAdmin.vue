<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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

// pedidos filtrados para exibição na tabela
const filteredPedidos = computed(() => {
  return pedidos.value.filter((p) => {

    // filtro por status
    if (statusFilter.value && p.status !== statusFilter.value) {
      return false;
    }

    // filtro de busca
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
  // ADMIN → GET /orders (já garantido no controller)
  pedidos.value = await apiGet("/orders", token);

  console.log(pedidos.value[0])
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

// NOVO: exportar pedidos para CSV
function exportPedidosToCsv() {
  const data = filteredPedidos.value.length
    ? filteredPedidos.value
    : pedidos.value;

  if (!data.length) return;

  // Cabeçalhos
  const headers = [
    "Nº Pedido",
    "Cliente",
    "Código",
    "Descrição",
    "Marca",
    "Quantidade",
    "Status",
    "Criado em",
    "Observações"
  ];

  const rows: string[][] = [];

  data.forEach((pedido) => {
    pedido.items.forEach((item) => {
      rows.push([
        String(pedido.numeroPedido ?? ""),
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
      <!-- <div class="filter-group">
        <label>Status</label>
        <select v-model="statusFilter">
          <option value="">Todos</option>
          <option v-for="s in statusOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div> -->

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
            <th>Código</th>
            <th>Descrição</th>
            <th>Observação</th>
            <th>Qtd</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in filteredPedidos" :key="pedido.id" class="pedido-row">
            <td>{{ pedido.numeroPedido ?? "-" }}</td>
            <td>
              <div class="pedido-codigo-lista">
                <div v-for="item in pedido.items" :key="item.volanteId">
                  <strong>{{ item.codigo }}</strong>
                  <span>({{ item.marcaNome }})</span>
                </div>
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
.container {
  padding: 16px;
  width: 100%;
  max-width: 1200px;   /* largura boa p/ desktop */
  margin: 0 auto;      /* centraliza no monitor */
}

@media (min-width: 900px) {
  .container {
    padding: 24px 32px;     /* mais respiro em desktop */
    max-width: 1300px;      /* aumenta a largura útil */
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
    min-width: 900px;       /* tabela mais larga em PC */
  }

  th, td {
    padding: 12px 14px;
  }
}

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
  min-width: 700px;
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

.filter-group select,
.filter-group input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* TABELA */
.table-container {
  width: 100%;
  overflow-x: auto; /* RESPONSIVO: rolagem horizontal em telas pequenas */
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* força layout de tabela em desktop */
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
}

th {
  font-weight: 600;
  color: #555;
}

tbody tr:hover {
  background: #fafafa;
}

/* Info do volante na célula */
.volante-info {
  display: flex;
  flex-direction: column;
}

.volante-info strong {
  font-size: 13px;
}

.volante-info span {
  font-size: 12px;
  color: #666;
}

/* Status */
.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 12px;
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
}

.export-row {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}

.btn-export {
  background: #5e72a8;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-export:hover {
  background: #1565c0;
}
</style>
