<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { apiGet, apiPostBlob } from "../../api/apiClient";

type EstoqueSalvo = {
  id: string;
  codigo: string;
  descricao: string;
  qtd_pedidos: string;
  qtd_estoque: string;
  qtd_injetar: string;
};

/* =======================
   ESTADOS
======================= */
const user = ref<any>(null);
const estoqueSalvo = ref<EstoqueSalvo[]>([]);

/* =======================
   LOADERS
======================= */
async function loadEstoqueSalvo() {
  estoqueSalvo.value = await apiGet("/estoque");
}

/* =======================
   COMPUTEDS
======================= */
const snapshotExiste = computed(() => estoqueSalvo.value.length > 0);

/* =======================
   AÇÕES
======================= */
async function exportarEstoque() {
  const payload = {
    estoque: estoqueSalvo.value
  };

  const blob = await apiPostBlob(
    "/orders/export-estoque",
    payload
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "controle_estoque.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/admin";
}

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user") || "null");
  await loadEstoqueSalvo();
});
</script>

<template>
  <div class="container">
    <div class="top-bar">
      <img
        src="../../../../assets/ev-volantes-logo.png"
        alt="EV Volantes"
        class="logo"
      />

      <div class="top-actions">
        <button
          v-if="snapshotExiste"
          class="btn-secondary"
          @click="exportarEstoque"
        >
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

    <h2>Estoque - Snapshot Salvo</h2>

    <div class="table-container" v-if="snapshotExiste">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Qtde Pedido</th>
            <th>Qtde Estoque</th>
            <th>Injetar</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in estoqueSalvo" :key="item.id">
            <td>{{ item.codigo }}</td>
            <td>{{ item.descricao }}</td>
            <td><strong>{{ item.qtd_pedidos }}</strong></td>
            <td>{{ item.qtd_estoque }}</td>
            <td>
              <strong>{{ item.qtd_injetar }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      Nenhum snapshot de estoque encontrado.
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

/* ✅ DESABILITADO (operador + snapshot) */
.estoque-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
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
  align-items: center;
  width: 33%;
  margin-left: auto;      /* 👈 empurra para a direita */
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid #eee;
  background: #fafafa;
  border-radius: 0 0 10px 10px;
}

</style>
