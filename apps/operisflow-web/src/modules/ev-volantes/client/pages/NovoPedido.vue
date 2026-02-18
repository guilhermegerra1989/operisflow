<script setup>
import { ref } from "vue";
import { apiPost } from "../../api/apiClient";

const title = ref("");
const description = ref("");
const token = localStorage.getItem("token");

async function criar() {
  await apiPost("/orders", token, {
    title: title.value,
    description: description.value
  });

  window.location.href = "/ev-volantes/client";
}
</script>

<template>
  <div class="container">
    <h2>Novo Pedido</h2>

    <input v-model="title" placeholder="Título" />
    <textarea v-model="description" placeholder="Descrição"></textarea>

    <button @click="criar">Criar Pedido</button>
  </div>
</template>