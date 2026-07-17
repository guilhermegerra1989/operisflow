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
  <div class="page">
    <div class="container">

    <div class="top-bar">
      <img
        src="../../../../assets/ev_volantes_image.png"
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
  margin-bottom: 16px;
  margin-right: 15px;
}

.logo {
  height: 55px;
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

.btn-logout {
  background: transparent;

  border: 2px solid #ef4444;

  color: #ef4444;

  padding: 10px 16px;

  border-radius: 10px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-logout:hover {
  background: rgba(239,68,68,.12);

  color: white;
}


h2 {
  text-align: center;

  color: white;

  font-size: 2rem;

  margin-bottom: 24px;
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
  min-width: 980px;
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
  color: #94a3b8;

  text-align: center;

  margin-top: 30px;
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
