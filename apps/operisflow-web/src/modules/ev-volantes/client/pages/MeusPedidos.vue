<script setup>
import { ref, onMounted } from "vue";
import { apiGet } from "../../api/apiClient";

const pedidos = ref([]);
const token = localStorage.getItem("token");

onMounted(async () => {
  pedidos.value = await apiGet("/orders/my", token);
});
</script>

<template>
  <div class="container">
    <h2>Meus Pedidos</h2>

    <div v-for="p in pedidos" :key="p.id" class="card">
      <strong>{{ p.title }}</strong><br/>
      <small>{{ p.description }}</small><br/>
      <small>Status: {{ p.status }}</small>
    </div>

    <button onclick="window.location.href='/ev-volantes/client/novo'">
      Novo Pedido
    </button>
  </div>
</template>