<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { apiGet } from "../../api/apiClient";

type PedidoItem = {
  volanteId: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  marcaNome?: string;
  img: string;
};

type Pedido = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  numeroPedido?: number;
  items: PedidoItem[];
};

const token: string = localStorage.getItem("token") ?? "";

// lista vinda da API (já agrupado por pedido)
const pedidos = ref<Pedido[]>([]);

// mapa de logos (igual você já usa)
const logoMarcas: Record<string, string> = {
  Chevrolet: "/marcas/chevrolet.png",
  Fiat: "/marcas/fiat.png",
  Ford: "/marcas/ford.png",
  Renault: "/marcas/renault.png",
  Volkswagen: "/marcas/volkswagen.png",
  Hyundai: "/marcas/hyundai.png",
  "Mercedes-Benz": "/marcas/mercedes.png",
};

// carrega pedidos do cliente
onMounted(async () => {
  pedidos.value = await apiGet("/orders/my", token);
});

// agrupa itens de cada pedido por marca
const pedidosAgrupados = computed(() => {
  return pedidos.value.map((p) => {
    const marcas: Record<string, PedidoItem[]> = {};

    p.items.forEach((item) => {
      const nomeMarca = item.marcaNome ?? "Outros";

      if (!marcas[nomeMarca]) {
        marcas[nomeMarca] = [];
      }
      marcas[nomeMarca].push(item);
    });

    return {
      ...p,
      marcas, // { [marcaNome]: PedidoItem[] }
    };
  });
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}
</script>

<template>
  <div class="container">
    <!-- HEADER COM NOME E LOGOUT -->
    <div class="top-bar">
      <img
        src="../../../../assets/ev-volantes-logo.png"
        alt="EV Volantes"
        class="logo"
      />
      <button class="btn-logout" @click="logout">Sair</button>
    </div>

    <!-- BOTÃO NOVO PEDIDO -->
    <router-link to="/ev-volantes/client/novo" class="btn-novo">
      Novo Pedido
    </router-link>

    <h2>Meus Pedidos</h2>

    <!-- SE NÃO TIVER PEDIDOS -->
    <div v-if="pedidos.length === 0" class="empty">
      Você ainda não fez nenhum pedido.
    </div>

    <!-- LISTAGEM AGRUPADA -->
    <div v-else>
      <div v-for="p in pedidosAgrupados" :key="p.id" class="card">
        <div class="pedido-header">
          <div class="pedido-title">
            N.{{ p.numeroPedido ?? "-" }} - {{ p.title }}
          </div>
          <div class="pedido-date">
            {{ new Date(p.createdAt).toLocaleString("pt-BR") }}
          </div>
        </div>

        <div v-if="p.description" class="pedido-description">
          Obs: {{ p.description }}
        </div>

        <!-- Agrupado por marca -->
        <div
          v-for="(itensMarca, marcaNome) in p.marcas"
          :key="String(marcaNome)"
          class="pedido-marca"
        >
          <div class="pedido-marca-header">
            <img
              :src="logoMarcas[marcaNome] || '/marcas/default.png'"
              class="marca-logo"
              :alt="marcaNome"
            />
            <span>{{ marcaNome }}</span>
          </div>

          <div
            v-for="item in itensMarca"
            :key="item.volanteId"
            class="pedido-item"
          >
          <div class="div_image"><img :src="item.img" :alt="item.codigo" /></div>
            <div class="pedido-item-left">
              <strong>{{ item.codigo }}</strong>
              <span>{{ item.descricao }}</span>
            </div>
            <div class="pedido-item-right">Qtde {{ item.quantidade }}</div>
          </div>
        </div>

        <div class="footer">
          <span class="status" :class="p.status">{{ p.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
}

h2 {
  margin-bottom: 16px;
}

.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}

.card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

.footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #777;
  margin-top: 8px;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-size: 11px;
}

/* Exemplos de cores por status – ajuste se quiser */
.status.aberto {
  background: #fff3cd;
  color: #856404;
}
.status.approved {
  background: #d4edda;
  color: #155724;
}
.status.done {
  background: #cce5ff;
  color: #004085;
}

.btn-novo {
  display: block;
  text-align: center;
  padding: 12px;
  background: #5e72a8;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  margin-bottom: 16px;
  text-decoration: none;
}

/* TOP BAR */
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

.btn-logout {
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

.btn-logout:hover {
  background: #ffebee;
}

/* PEDIDO */
.pedido-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.pedido-title {
  font-size: 16px;
  font-weight: 700;
}

.pedido-date {
  font-size: 12px;
  color: #666;
}

.pedido-description {
  font-size: 13px;
  margin-bottom: 10px;
}

/* MARCAS E ITENS */
.pedido-marca {
  margin-bottom: 12px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
}

.pedido-marca-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #5e72a8;
  margin-bottom: 6px;
}

.marca-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.pedido-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dotted #ddd;
}

.pedido-item:last-child {
  border-bottom: none;
}

.pedido-item-left {
  display: flex;
  flex-direction: column;
}

.pedido-item-left strong {
  font-size: 13px;
}

.pedido-item-left span {
  font-size: 12px;
  color: #555;
}

.pedido-item-right {
  font-weight: 700;
  font-size: 14px;
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
</style>