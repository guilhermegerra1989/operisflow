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

    <h2>Dashboard</h2>

    <!-- GRID DE BOTÕES / CARDS PRINCIPAIS -->
    <div class="menu-grid">
      <!-- <router-link to="/ev-volantes/admin/users" class="btn menu-card">
        <h3>Usuários</h3>
        <p>Gerenciar clientes e administradores</p>
      </router-link>

      <router-link to="/ev-volantes/admin/volantes" class="btn menu-card">
        <h3>Tipos de Volantes</h3>
        <p>Configurar tipos de volantes disponíveis</p>
      </router-link>
-->
      <router-link to="/ev-volantes/operator/pedidos" class="btn menu-card">
        <h3>Pedidos</h3>
        <p>Visualizar pedidos</p>
      </router-link> 
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
}

/* Topo */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px; /* bom para mobile e desktop */
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

/* Título */
h2 {
  margin-bottom: 16px;
}

/* Grid de menu – bom em PC, quebra em mobile */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

/* Botão base que você já tinha */
.btn {
  display: block;
  text-align: left;
  padding: 16px;
  background: #5e72a8;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  margin-bottom: 0; /* grid já controla espaçamento */
  text-decoration: none;
}

/* Estilo de card para os itens de menu */
.menu-card {
  background: #5e72a8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: 0.2s;
}

.menu-card:hover {
  background: #5e72a8;
  transform: translateY(-2px);
}

.menu-card h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
}

.menu-card p {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
}

</style>