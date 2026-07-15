<script setup lang="ts">
import { ref,onMounted, nextTick } from "vue";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../api/apiClient";

type Marca = {
  id: string;
  nome: string;
  descricao: string;
};

const marcas = ref<Marca[]>([]);
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
async function loadMarcas() {
  try {
    loading.value = true;
    error.value = "";
    marcas.value = await apiGet("/marcas");
  } catch (e: any) {
    error.value = "Erro ao carregar marcas";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadMarcas);

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
      await apiPatch(`/marcas/${editingId.value}`, {
        nome: nome.value,
        descricao: descricao.value,
      });
    } else {
      await apiPost("/marcas", {
        nome: nome.value,
        descricao: descricao.value,
      });
    }

    resetForm();
    await loadMarcas();
  } catch (e: any) {
    error.value = "Erro ao salvar marcas";
    console.error(e);
  }
}

// clicar em editar
async function editar(v: Marca) {
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
  if (!confirm(`Remover marca ${v.nome} - ${v.descricao}?`)) return;

  try {
    await apiDelete(`/marcas/${v.id}`);
    await loadMarcas();
  } catch (e: any) {
    error.value = "Erro ao remover marca";
    console.error(e);
  }
}

function exportToCsv() {
  if (!marcas.value.length) return;

  // Cabeçalhos
  const headers = ["ID", "Nome", "Descrição"];

  // Linhas
  const rows = marcas.value.map((v) => [
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
  link.setAttribute("download", "marcas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

</script>

<template>
 <div class="page">
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

    <h2>Listagem de Marcas</h2>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- FORMULÁRIO -->
    <div class="card form-card" :class="{ editing: editingId }" ref="formRef">
      <h3>{{ editingId ? "Editar Marca" : "Nova Marca" }}</h3>

      <label class="label">Código *</label>
      <input
        v-model="nome"
        class="input"
        placeholder="Ex: Chevrolet"
        ref="codigoInputRef"
      />

      <label class="label">Descrição *</label>
      <input
        v-model="descricao"
        class="input"
        placeholder="Ex: Gm Chevrolet"
      />

      <div class="form-actions">
        <button @click="salvar" class="btn-primary">
          {{ editingId ? "Salvar Alterações" : "Cadastrar Marca" }}
        </button>
        <button v-if="editingId" @click="resetForm" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>

    <!-- LISTA -->
    <div class="card list-card">
      <h3>Marcas Cadastradas</h3>

      <div v-if="loading">Carregando...</div>
      <div v-else-if="marcas.length === 0">Nenhuma marca cadastrada.</div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th style="width: 140px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in marcas" :key="v.id">
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
  </div>
</template>

<style scoped>
h2 {
  text-align: center;

  color: white;

  font-size: 2rem;

  margin-bottom: 24px;
}

h3 {
  text-align: center;

  color: white;

  margin-bottom: 24px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.card {
  margin-bottom: 20px;

  padding: 20px;

  border-radius: 20px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.03),
      rgba(255,255,255,.01)
    );

  border: 1px solid rgba(255,255,255,.06);

  backdrop-filter: blur(12px);

  transition:
    border-color .25s ease,
    box-shadow .25s ease,
    transform .25s ease;
}

.card:hover {
  transform: translateY(-2px);

  border-color: rgba(0,75,255,.5);

  box-shadow:
    0 0 0 1px rgba(0,75,255,.35),
    0 0 25px rgba(0,75,255,.15),
    0 10px 30px rgba(0,0,0,.35);
}

.form-card {
  margin-bottom: 24px;
}

.form-card.editing {
  border: 1px solid #004BFF;

  box-shadow:
    0 0 0 1px rgba(0,75,255,.4),
    0 0 30px rgba(0,75,255,.25);
}

.label {
  color: #cbd5e1;

  font-size: 14px;

  font-weight: 600;

  display: block;

  margin-top: 10px;
}

.input {
  width: 100%;

  padding: 12px 14px;

  margin-top: 6px;

  border-radius: 12px;

  border: 1px solid rgba(255,255,255,.08);

  background: rgba(255,255,255,.03);

  color: white;

  font-size: 14px;

  transition: .25s;
}

.input:focus {
  outline: none;

  border-color: #004BFF;

  box-shadow:
    0 0 0 4px rgba(0,75,255,.15);
}

.form-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary {
  background:
    linear-gradient(
      135deg,
      #004BFF,
      #2563eb
    );

  color: white;

  border: none;

  padding: 12px 16px;

  border-radius: 12px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-primary:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 25px rgba(0,75,255,.35);
}

.list-card {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  color: #4d7cff;

  font-weight: 700;

  padding: 14px;

  border-bottom: 1px solid rgba(255,255,255,.08);
}

.table td {
  color: #e2e8f0;

  padding: 14px;

  border-bottom: 1px solid rgba(255,255,255,.06);
}

.table tbody tr:hover {
  background: rgba(0,75,255,.05);
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
  background: rgba(239,68,68,.12);

  color: #f87171;

  border: 1px solid rgba(239,68,68,.25);
}

.btn-edit {
  background: rgba(0,75,255,.15);

  color: #4d7cff;

  border: 1px solid rgba(0,75,255,.3);

  padding: 8px 12px;

  border-radius: 10px;

  font-weight: 600;
}

.btn-edit:hover {
  background: rgba(0,75,255,.25);
}


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
  max-width: 1200px;

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

/* TOPO */
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

.top-actions {
  display: flex;
  gap: 8px;
}

.btn-secondary {
  background: transparent;

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 8px 14px;

  border-radius: 10px;

  font-weight: 700;

  transition: .25s;
}

.btn-secondary:hover {
  background: rgba(0,75,255,.12);

  color: white;
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

.error {
  background: rgba(239,68,68,.08);

  border: 1px solid rgba(239,68,68,.2);

  color: #f87171;

  padding: 12px;

  border-radius: 12px;

  margin-bottom: 16px;
}

</style>