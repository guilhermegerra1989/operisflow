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
  pedidos.value = await apiGet("/orders/my");
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
  
<div class="page">
  <div class="container">

    <!-- HEADER COM NOME E LOGOUT -->
    <div class="top-bar">
      <img
        src="../../../../assets/ev_volantes_image.png"
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

            <!-- AQUI -->
            <div class="pedido-item">
              <div class="div_image"><img :src="item.img" :alt="item.codigo" /></div>
             
              <div class="pedido-item-left">
                  <strong>{{ item.codigo }}</strong>
                  <span>{{ item.descricao }}</span>
              </div>
              
              <div class="pedido-item-right">
                Qtde {{ item.quantidade }}
              </div>
            </div>
          </div>

        </div>

        <div class="footer">
          <span class="status" :class="p.status">{{ p.status }}</span>
        </div>
      </div>
    </div>
  </div>
  </div>

<!-- WHATSAPP -->
    <a
      href="https://wa.me/5512982669702?text=Olá! Vim pelo site e gostaria de mais informações."
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-container"
    >
      <div class="whatsapp-button">
        <!-- SVG LIMPO -->
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.87 11.87 0 0012.06 0C5.6 0 .34 5.28.34 11.8c0 2.08.54 4.1 1.56 5.88L0 24l6.52-1.7a11.74 11.74 0 005.54 1.4h.01c6.46 0 11.72-5.28 11.72-11.8 0-3.15-1.22-6.1-3.27-8.42zm-8.46 18.1h-.01a9.8 9.8 0 01-5-1.36l-.36-.21-3.87 1.01 1.03-3.77-.24-.39a9.77 9.77 0 01-1.5-5.26c0-5.41 4.38-9.8 9.77-9.8 2.61 0 5.07 1.02 6.92 2.88a9.73 9.73 0 012.87 6.93c0 5.4-4.38 9.79-9.76 9.79zm5.45-7.32c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.52.08-.8.38-.28.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.1 4.48.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.13-.27-.2-.57-.35z"
          />
        </svg>
      </div>

      <span class="whatsapp-label">Fale conosco</span>
    </a>

</template>

<style scoped>
.page {
  min-height: 100vh;

  display: flex;
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

h2 {
  text-align: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 24px;
}

.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}

.card {
  margin-bottom: 20px;

  padding: 20px;

  border-radius: 20px;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  backdrop-filter: blur(12px);

  border: 1px solid rgba(0,75,255,.18);

  box-shadow:
    0 10px 30px rgba(0,0,0,.25);

  transition: .25s;
}

.card:hover {
  border-color: rgba(0,75,255,.5);
}

.footer {
  margin-top: 16px;
}

.status {
  display: inline-flex;

  align-items: center;

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 12px;

  font-weight: 700;

  text-transform: uppercase;
}

/* Exemplos de cores por status – ajuste se quiser */
.status.aberto {
  background: rgba(245,158,11,.15);
  color: #fbbf24;
  border: 1px solid rgba(245,158,11,.3);
}


.status.approved {
  background: rgba(34,197,94,.15);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,.3);
}


.status.done {
  background: rgba(59,130,246,.15);
  color: #60a5fa;
  border: 1px solid rgba(59,130,246,.3);
}


.btn-novo {
  display: block;

  text-align: center;

  padding: 14px;

  margin-bottom: 24px;

  border-radius: 14px;

  text-decoration: none;

  color: white;

  font-weight: 700;

  background:
    linear-gradient(
      135deg,
      #004BFF,
      #2563eb
    );

  box-shadow:
    0 12px 30px rgba(0,75,255,.25);

  transition: all .25s ease;
}

.btn-novo:hover {
  transform: translateY(-2px);

  box-shadow:
    0 16px 40px rgba(0,75,255,.35);
}

/* TOP BAR */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  color: white;
}

.pedido-date {
  font-size: 12px;
  color: #94a3b8;
}

.pedido-description {
  margin-top: 10px;
  margin-bottom: 15px;

  padding: 10px;

  border-radius: 10px;

  background: rgba(255,255,255,.04);

  color: #cbd5e1;
}

/* MARCAS E ITENS */
.pedido-marca {
  margin-top: 12px;

  padding: 14px;

  border-radius: 14px;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.05);
}

.pedido-marca-header {
  display: flex;
  align-items: center;
  gap: 10px;

  color: #4d7cff;

  font-weight: 700;

  margin-bottom: 10px;

  border-bottom: 1px solid rgba(255,255,255,.06);

  padding-bottom: 8px;
}

.marca-logo {
  width: 40px;
  height: 40px;
}

.pedido-item {
  display: grid;
  grid-template-columns: 70px 1fr auto;

  gap: 12px;

  align-items: center;

  padding: 12px 0;

  border-bottom: 1px solid rgba(255,255,255,.06);
}

.pedido-item:last-child {
  border-bottom: none;
}

.div_image {
  width: 70px;
  height: 70px;

  background: white;

  border-radius: 12px;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.div_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pedido-item-left {
  display: flex;
  flex-direction: column;
  min-width: 170px; /* permite quebrar texto sem empurrar qtde */
}


.pedido-item-left strong {
  color: white;
  font-size: 14px;
}

.pedido-item-left span {
  color: #94a3b8;
  font-size: 13px;
}

.pedido-item-right {
  background: rgba(0,75,255,.15);

  color: #4d7cff;

  border: 1px solid rgba(0,75,255,.3);

  padding: 8px 12px;

  border-radius: 999px;

  font-weight: 700;
}

.whatsapp-container {
  animation: shakeWhatsapp 6s infinite;
  position: fixed;
  bottom: 24px;
  right: 24px;

  display: flex;
  align-items: center;
  gap: 10px;

  text-decoration: none;
  z-index: 999;
}

@keyframes shakeWhatsapp {

  0%,
  90%,
  100% {
    transform: rotate(0);
  }

  91% {
    transform: rotate(-8deg);
  }

  92% {
    transform: rotate(8deg);
  }

  93% {
    transform: rotate(-8deg);
  }

  94% {
    transform: rotate(8deg);
  }

  95% {
    transform: rotate(0);
  }
}

.whatsapp-button {
  width: 60px;
  height: 60px;

  border-radius: 50%;

  background: #25d366;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: pulseWhatsapp 2s infinite;
}

@keyframes pulseWhatsapp {

  0% {
    box-shadow:
      0 0 0 0 rgba(37,211,102,.6);
  }

  70% {
    box-shadow:
      0 0 0 18px rgba(37,211,102,0);
  }

  100% {
    box-shadow:
      0 0 0 0 rgba(37,211,102,0);
  }

}

/* SVG */
.whatsapp-button svg {
  width: 26px;
  height: 26px;
}

/* hover */
.whatsapp-button:hover {
  transform: scale(1.08);
  background: #1ebe5d;
}

/* label */
.whatsapp-label {
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;

  padding: 8px 12px;
  border-radius: 8px;

  font-size: 0.8rem;
  white-space: nowrap;

  opacity: 0;
  transform: translateX(10px);
  transition: 0.25s;
}

/* aparecer no hover */
.whatsapp-container:hover .whatsapp-label {
  opacity: 1;
  transform: translateX(0);
}

/* mobile */
@media (max-width: 768px) {
  .whatsapp-button {
    width: 52px;
    height: 52px;
  }

  .whatsapp-label {
    display: none;
  }
}

</style>