<script setup lang="ts">
import { ref,onMounted, nextTick } from "vue";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../api/apiClient";

const token = localStorage.getItem("token") ?? "";

type Rota = {
  id: string;
  nome: string;
  descricao: string;
};

const rotas = ref<Rota[]>([]);
const loading = ref(false);
const error = ref("");

// formulário
const editingId = ref<string | null>(null);
const nome = ref("");
const descricao = ref("");


// refs para scroll e foco
const formRef = ref<HTMLElement | null>(null);
const codigoInputRef = ref<HTMLInputElement | null>(null);

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

function voltarDashboard() {
  window.location.href = "/ev-volantes/admin";
}

// carregar rotas
async function loadRotas() {
  try {
    loading.value = true;
    error.value = "";
    rotas.value = await apiGet("/rotas", token);
  } catch (e: any) {
    error.value = "Erro ao carregar rotas";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadRotas);

// limpar formulário
function resetForm() {
  editingId.value = null;
  nome.value = "";
  descricao.value = "";
}

// criar ou atualizar
async function salvar() {
  if (!nome.value || !descricao.value) {
    alert("Nome e descrição são obrigatórios.");
    return;
  }

  try {
    if (editingId.value) {
      await apiPatch(`/rotas/${editingId.value}`, token, {
        nome: nome.value,
        descricao: descricao.value,
      });
    } else {
      await apiPost("/rotas", token, {
        nome: nome.value,
        descricao: descricao.value,
      });
    }

    resetForm();
    await loadRotas();
  } catch (e: any) {
    error.value = "Erro ao salvar rota";
    console.error(e);
  }
}

// clicar em editar
async function editar(v: Rota) {
  editingId.value = v.id;
  nome.value = v.nome;
  descricao.value = v.descricao;

  // espera a DOM atualizar (título do form, botões, etc.)
  await nextTick();

  // rola até o formulário
  formRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  // foca no campo de código
  codigoInputRef.value?.focus();
}

// remover
async function remover(v: any) {
  if (!confirm(`Remover rota ${v.nome} - ${v.descricao}?`)) return;

  try {
    await apiDelete(`/rotas/${v.id}`, token);
    await loadRotas();
  } catch (e: any) {
    error.value = "Erro ao remover rota";
    console.error(e);
  }
}

function exportToCsv() {
  if (!rotas.value.length) return;

  // Cabeçalhos
  const headers = ["ID", "Nome", "Descrição"];

  // Linhas
  const rows = rotas.value.map((v) => [
    v.id,
    v.nome,
    v.descricao,
  ]);

  // Monta o conteúdo CSV
  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`) // escapa aspas
          .join(";") // separador ; (mais comum em PT-BR)
      )
      .join("\n");

  // Cria o blob e dispara download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "rotas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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
        <button class="btn-secondary" @click="exportToCsv">
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

    <h2>Listagem de Rotas</h2>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- FORMULÁRIO -->
    <div class="card form-card" :class="{ editing: editingId }" ref="formRef">
      <h3>{{ editingId ? "Editar Rota" : "Nova Rota" }}</h3>

      <label class="label">Código *</label>
      <input
        v-model="nome"
        class="input"
        placeholder="Ex: Rota Sul"
        ref="codigoInputRef"
      />

      <label class="label">Descrição *</label>
      <input
        v-model="descricao"
        class="input"
        placeholder="Ex: Rota Sul do Brasil"
      />

      <div class="form-actions">
        <button @click="salvar" class="btn-primary">
          {{ editingId ? "Salvar Alterações" : "Cadastrar Rota" }}
        </button>
        <button v-if="editingId" @click="resetForm" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>

    <!-- LISTA -->
    <div class="card list-card">
      <h3>Rotas Cadastradas</h3>

      <div v-if="loading">Carregando...</div>
      <div v-else-if="rotas.length === 0">Nenhuma rota cadastrada.</div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th style="width: 140px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in rotas" :key="v.id">
            <td>{{ v.nome }}</td>
            <td>{{ v.descricao }}</td>
            <td class="actions">
              <button @click="editar(v)" class="btn-edit">Editar</button>
              <button @click="remover(v)" class="btn-small danger">
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 16px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
}

.form-card {
  margin-bottom: 24px;
}

.label {
  font-size: 14px;
  font-weight: 600;
  display: block;
  margin-top: 10px;
}

.input {
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 14px;
}

.form-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #5e72a8;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-small:hover {
  opacity: 0.9;
}

.list-card {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.actions {
  display: flex;
  gap: 6px;
}

.btn-small {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  background: #dfdcdc;
}

.btn-small.danger {
  background: #ffcdd2;
  color: #b71c1c;
}

.btn-edit {
  background: #5e72a8;
  color: #ffffff;
}

.btn-edit:hover {
  background: #465684; /* tom mais escuro no hover */
}

.logo {
  height: 36px;         /* tamanho ideal para mobile */
  object-fit: contain;
}

.container {
  padding: 16px;
}

/* TOPO */
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

.top-actions {
  display: flex;
  gap: 8px;
}

/* Botões */
.btn-secondary {
  background: transparent;
  border: 1px solid #1e88e5;
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

.form-card.editing {
  border: 2px solid #5e72a8;
  box-shadow: 0 0 0 2px rgba(94, 114, 168, 0.15);
}

</style>