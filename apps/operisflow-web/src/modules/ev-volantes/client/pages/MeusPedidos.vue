<script setup lang="ts">
import { ref, onMounted } from "vue";
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
};

const pedidos = ref<Pedido[]>([]);
const token: string = localStorage.getItem("token") ?? "";

onMounted(async () => {
  pedidos.value = await apiGet("/orders/my", token);
});
</script>

<template>
  <div class="container">

    <!-- BOTÃO NOVO PEDIDO SEMPRE NO TOPO -->
    <router-link to="/ev-volantes/client/novo" class="btn-novo">
      Novo Pedido
    </router-link>

    <h2>Meus Pedidos</h2>

    <!-- SE NÃO TIVER PEDIDOS -->
    <div v-if="pedidos.length === 0" class="empty">
      Você ainda não fez nenhum pedido.
    </div>

    <!-- LISTAGEM -->
    <div v-for="p in pedidos" :key="p.id" class="card">

      <div class="volante">
        <strong>{{ p.volante_codigo }}</strong>
        <span>{{ p.volante_descricao }}</span>
      </div>

      <div class="nf">
        NF: <strong>{{ p.numero_nota_fiscal }}</strong>
      </div>

      <div class="qty">
        Quantidade: <strong>{{ p.quantidade }}</strong>
      </div>

      <div class="title">{{ p.title }}</div>

      <div class="desc" v-if="p.description">{{ p.description }}</div>

      <div class="footer">
        <span class="status" :class="p.status">
          {{ p.status }}
        </span>
        <span class="date">
          {{ new Date(p.created_at).toLocaleString() }}
        </span>
      </div>

    </div>
  </div>
</template>

<style scoped>

.btn-novo {
  display: block;
  text-align: center;
  padding: 12px;
  background: #1e88e5;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  margin-bottom: 16px;
  text-decoration: none;
}

.qty {
  font-size: 13px;
  margin-bottom: 8px;
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

.volante {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

.volante strong {
  font-size: 14px;
}

.volante span {
  font-size: 13px;
  color: #555;
}

.nf {
  font-size: 13px;
  margin-bottom: 8px;
}

.title {
  font-weight: 600;
  margin-bottom: 4px;
}

.desc {
  font-size: 14px;
  color: #444;
  margin-bottom: 10px;
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

/* Exemplos de cores por status – pode ajustar depois */
.status.pending {
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

</style>