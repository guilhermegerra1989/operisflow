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
      <img src="../../../../assets/ev-volantes-logo.png" alt="EV Volantes" class="logo" />
      <button class="btn-logout" @click="logout">Sair</button>
    </div>

    <!-- BOTÃO NOVO PEDIDO SEMPRE NO TOPO -->
    <router-link to="/ev-volantes/admin/users" class="btn">
      Usuários
    </router-link>

    <!-- BOTÃO NOVO PEDIDO SEMPRE NO TOPO -->
    <router-link to="/ev-volantes/admin/volantes" class="btn">
      Tipos de Volantes
    </router-link>

  </div>
</template>

<style scoped>

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


.btn {
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


.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logo {
  height: 36px;         /* tamanho ideal para mobile */
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

</style>