<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { apiGet } from "../../api/apiClient";

type Pedido = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  numero_nota_fiscal: string;
  volante_codigo: string;
  volante_descricao: string;
  quantidade: number;
  client_name?: string;
};

const token: string = localStorage.getItem("token") ?? "";

// lista completa vinda da API
const pedidos = ref<Pedido[]>([]);

// filtros
const statusFilter = ref<string>(""); // "" = todos
const searchTerm = ref<string>("");

// lista de status distintos (montada a partir dos dados)
// const statusOptions = computed(() => {
//   const set = new Set<string>();
//   pedidos.value.forEach((p) => {
//     if (p.status) set.add(p.status);
//   });
//   return Array.from(set);
// });

// pedidos filtrados para exibição na tabela
const filteredPedidos = computed(() => {
  return pedidos.value.filter((p) => {
    // filtro por status
    if (statusFilter.value && p.status !== statusFilter.value) {
      return false;
    }

    // filtro de busca (nf, título, código, descrição)
    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase();
      const haystack = [
        p.numero_nota_fiscal,
        p.title,
        p.description,
        p.volante_codigo,
        p.volante_descricao,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(term)) {
        return false;
      }
    }

    return true;
  });
});

async function loadPedidos() {
  // ADMIN → GET /orders (já garantido no controller)
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
          placeholder="NF, título, código ou descrição..."
        />
      </div>
    </div>

    <!-- TABELA -->
    <div class="table-container" v-if="filteredPedidos.length">
      <table>
        <thead>
          <tr>
            <th>NF</th>
            <th>Título</th>
            <th>Volante</th>
            <th>Qtd</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredPedidos" :key="p.id">
            <td>{{ p.numero_nota_fiscal || '-' }}</td>
            <td>{{ p.title }}</td>
            <td>
              <div class="volante-info">
                <strong>{{ p.volante_codigo }}</strong>
                <span>{{ p.volante_descricao }}</span>
              </div>
            </td>
            <td>{{ p.quantidade }}</td>
            <td>
              <span class="badge">
                {{ p.status }}
              </span>
            </td>
            <td>{{ formatDate(p.created_at) }}</td>
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
  border: 1px solid #1e88e5;
  color: #1e88e5;
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
</style>
