<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { apiGet, apiPatch, apiPostBlob } from "../../api/apiClient";

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
  nome_fantasia?: string;
  razao_social?: string;
  address?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  tipo?: string;
  items: PedidoItem[];
  telcomercial: string;
  telpessoal: string;
  bairro: string;
  estado: string;
  cep: string;
  inscricao_estadual: string;
  inscricao_municipal: string;
};


interface Order {
  orderNumber: string;
  createdAt: string;
  tipo: string;
  client: {
    name: string;
    address: string;
    cnpj: string;
    email: string;
    phone: string;
    nome_fantasia: string;
    razao_social: string;
    telcomercial: string;
    telpessoal: string;
    bairro: string;
    estado: string;
    cep: string;
    inscricao_estadual: string;
    inscricao_municipal: string;
  };
  items: Array<{
    code: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

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
        p.tipo ?? "",
        p.address ?? "",
        p.cnpj ?? "",
        p.phone ?? "",
        p.telcomercial ?? "",
        p.telpessoal ?? "",
        p.bairro ?? "",
        p.estado ?? "",
        p.cep ?? "",
        p.inscricao_estadual ?? "",
        p.inscricao_municipal ?? "",
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
  pedidos.value = await apiGet("/orders");
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
      `/orders/${pedidoId}`, payload
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

/**
 * Re-Abrir PEDIDO
 */

async function reAbrirPedido(pedidoId: string) {
  const confirmar = confirm("Deseja realmente reabrir este pedido?");
  if (!confirmar) return;

  try {

    const payload = {
       status: "aberto"
    };

    await apiPatch(
      `/orders/${pedidoId}`, payload
    );

    // atualiza status local
    const pedido = pedidos.value.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.status = "aberto";
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao reabrir o pedido.");
  }
}


async function exportOrder(pedido: Pedido) {
  const order = mapPedidoToOrder(pedido);
  const blob = await apiPostBlob("/orders/export", order);

  const url = URL.createObjectURL(blob);


  const a = document.createElement("a");
  a.href = url;
  a.download = `order-${order.orderNumber}.xlsx`;
  a.click();

  URL.revokeObjectURL(url);
}

function mapPedidoToOrder(pedido: Pedido): Order {
  return {
    orderNumber: String(pedido.numeroPedido ?? pedido.id),
    createdAt: pedido.createdAt,
    tipo: pedido.tipo ?? "",

    client: {
      name: pedido.clientName ?? "",
      address: pedido.address ?? "", 
      cnpj: pedido.cnpj ?? "",    
      email: pedido.email ?? "",   
      phone: pedido.phone ?? "",    
      nome_fantasia: pedido.nome_fantasia ?? "",  
      razao_social: pedido.razao_social ?? "", 
      telcomercial: pedido.telcomercial ?? "",
      telpessoal: pedido.telpessoal ?? "",
      bairro: pedido.bairro ?? "",
      estado: pedido.estado ?? "",
      cep: pedido.cep ?? "",
      inscricao_estadual: pedido.inscricao_estadual ?? "",
      inscricao_municipal: pedido.inscricao_municipal ?? "",

    },

    items: pedido.items.map((item) => ({
      code: item.codigo,
      description: item.descricao,
      quantity: item.quantidade,
      unitPrice: 0, // não existe no Pedido
    })),
  };
}

// export CSV (igual você já tem)
function exportPedidosToCsv() {
  const data = filteredPedidos.value.length
    ? filteredPedidos.value
    : pedidos.value;

  if (!data.length) return;

  const headers = [
    "Ped",
    "Rota",
    "Cliente",
    "Cod",
    "Desc",
    "Marca",
    "Quantidade",
    "Status",
    "Criado",
    "Obs",
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
  <div class="page">
    <div class="container">
    <!-- HEADER -->
    <div class="top-bar">
      <img
        src="../../../../assets/ev_volantes_image.png"
        alt="EV Volantes"
        class="logo"
      />
      <div class="top-actions">
        <button class="btn-secondary" @click="exportPedidosToCsv()">
          Csv
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
            <th>Ped.</th>
            <th>Rota</th>
            <th>Desc.</th>
            <!-- <th>Descrição</th> -->
            <th>Qtd</th>
            <th>Obs</th>
            <!-- <th>Status</th> -->
            <th>Criado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="pedido in filteredPedidos" :key="pedido.id">
            <td>{{ pedido.numeroPedido ?? "-" }}</td>
            <td>{{ pedido.title }}</td>

            <td>
              <div v-for="item in pedido.items" :key="item.volanteId">
                <strong>{{ item.descricao }}</strong>
                <!-- <span> ({{ item.marcaNome }})</span> -->
              </div>
            </td>

            <td>
              <div v-for="item in pedido.items" :key="item.volanteId">
                {{ item.quantidade }}
              </div>
            </td>

             <td>{{ pedido.description || "-" }}</td>

            <!-- <td>
              <span class="badge">{{ pedido.status }}</span>
            </td> -->

            <td>
              
                <div style="padding-bottom: 20px;">
                  <span 
                    class="badge"
                    :class="{
                      'badge-success': pedido.status === 'aberto',
                      'badge-warning': pedido.status === 'Finalizado',
                      'badge-danger': pedido.status === 'cancelado'
                    }"
                  >
                    status: {{ pedido.status }}
                  </span>
                </div>

                <div>

{{ formatDate(pedido.createdAt) }}
                </div>
              
              
            </td>

            <!-- AÇÕES -->
            <td>
              <button
                class="btn-export"
                @click="exportOrder(pedido)"
              >
                Exportar
              </button>

              <button
                v-if="pedido.status === 'aberto'"
                class="btn-finalizar"
                @click="finalizarPedido(pedido.id)"
              >
                Finalizar
              </button>

              <button
                v-if="pedido.status === 'Finalizado'"
                class="btn-finalizar"
                @click="reAbrirPedido(pedido.id)"
              >
                Reabrir Pedido
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
  </div>
</template>

<style scoped>

.page {
  min-height: 100vh;

  background:
    linear-gradient(
      135deg,
      #111111,
      #171717,
      #0d0d0d
    );

  padding: 30px;
}

.container {
  max-width: 1300px;
  margin: 0 auto;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 24px;

  padding: 32px;

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);
}

.container:hover {

  transform: translateY(-4px);

  border-color: #004BFF;

  box-shadow:
    0 18px 45px rgba(0,75,255,.25);
}


:deep(body) {
  background:
    linear-gradient(
      135deg,
      #111111,
      #171717,
      #0d0d0d
    );
}

@media (min-width: 900px) {
  .container {
    padding: 24px 32px;
    max-width: 1300px;
  }

h2 {
  color: white;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 24px;
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

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  height: 55px;
  object-fit: contain;
  filter: brightness(0) invert(1);
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

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 10px 16px;

  border-radius: 10px;

  font-weight: 700;

  transition: .25s;
}

.btn-secondary:hover {
  background: rgba(0,75,255,.12);
  color: white;
}

.btn-secondary:hover {
  background: #e3f2fd;
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



/* =========================
   FILTROS
   ========================= */
.filters {
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 320px;
}

.filter-group label {
  color: #cbd5e1;
  font-weight: 600;
  margin-bottom: 6px;
}

.filter-group input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  color: white;
  transition: .25s;
}

.filter-group input::placeholder {
  color: #94a3b8;
}

.filter-group input:focus {
  outline: none;
  border-color: #004BFF;
  box-shadow:
    0 0 0 4px rgba(0,75,255,.15);
}

/* =========================
   TABELA
   ========================= */
.table-container {
  overflow-x: auto;
  transition: .3s ease;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 24px;

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);

  padding: 16px;
}

.table-container:hover {

  border-color: rgba(0,75,255,.5);

  box-shadow:
    0 10px 30px rgba(0,75,255,.15);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

thead {
  background: rgba(0,75,255,.15);
}

th {
  color: #e2e8f0;
  font-weight: 700;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid rgba(255,255,255,.05);
  color: white;
  font-size: 13px;
  text-align: left;
  vertical-align: middle;
}

tbody tr {
  transition: .2s;
}

tbody tr:hover {
  background: rgba(255,255,255,.03);
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
   color: #94a3b8;
}

/* =========================
   STATUS
   ========================= */
.badge {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
}

/* =========================
   AÇÕES
   ========================= */
.btn-finalizar {
  border: none;

  padding: 8px 12px;

  border-radius: 10px;

  background: #22c55e;

  color: white;

  font-weight: 700;

  cursor: pointer;
}

.btn-export {
  border: none;

  padding: 8px 12px;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #004BFF,
      #2563eb
    );

  color: white;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}


.btn-export:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 25px rgba(0,75,255,.35);
}

.btn-finalizar:hover {
  background: #16a34a;
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
  color: #94a3b8;
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

.badge-success {
  background: rgba(34,197,94,.15);
  color: #22c55e;
}

.badge-warning {
  background: rgba(245,158,11,.15);
  color: #fbbf24;
}

.badge-danger {
  background: rgba(239,68,68,.15);
  color: #ef4444;
}
</style>