<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../api/apiClient";

const token = localStorage.getItem("token") ?? "";

type Volante = {
  id: string;
  codigo: string;
  descricao: string;
};

const volantes = ref<Volante[]>([]);
const loading = ref(false);
const error = ref("");

// formulário
const editingId = ref<string | null>(null);
const codigo = ref("");
const descricao = ref("");

function voltar() {
  window.location.href = "/ev-volantes/admin";
}

// carregar volantes
async function loadVolantes() {
  try {
    loading.value = true;
    error.value = "";
    volantes.value = await apiGet("/volantes", token);
  } catch (e: any) {
    error.value = "Erro ao carregar volantes";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadVolantes);

// limpar formulário
function resetForm() {
  editingId.value = null;
  codigo.value = "";
  descricao.value = "";
}

// criar ou atualizar
async function salvar() {
  if (!codigo.value || !descricao.value) {
    alert("Código e descrição são obrigatórios.");
    return;
  }

  try {
    if (editingId.value) {
      await apiPatch(`/volantes/${editingId.value}`, token, {
        codigo: codigo.value,
        descricao: descricao.value,
      });
    } else {
      await apiPost("/volantes", token, {
        codigo: codigo.value,
        descricao: descricao.value,
      });
    }

    resetForm();
    await loadVolantes();
  } catch (e: any) {
    error.value = "Erro ao salvar volante";
    console.error(e);
  }
}

// clicar em editar
function editar(v: any) {
  editingId.value = v.id;
  codigo.value = v.codigo;
  descricao.value = v.descricao;
}

// remover
async function remover(v: any) {
  if (!confirm(`Remover volante ${v.codigo} - ${v.descricao}?`)) return;

  try {
    await apiDelete(`/volantes/${v.id}`, token);
    await loadVolantes();
  } catch (e: any) {
    error.value = "Erro ao remover volante";
    console.error(e);
  }
}

function exportToCsv() {
  if (!volantes.value.length) return;

  // Cabeçalhos
  const headers = ["ID", "Código", "Descrição"];

  // Linhas
  const rows = volantes.value.map((v) => [
    v.id,
    v.codigo,
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
  link.setAttribute("download", "volantes.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

</script>





<template>
  <div class="container">


    <div class="top-bar">
      <img src="../../../../assets/ev-volantes-logo.png" alt="EV Volantes" class="logo" />
      <button class="btn-voltar" @click="voltar()">Voltar</button>
    </div>

    <h2>Catálogo de Volantes</h2>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- FORMULÁRIO -->
    <div class="card form-card">
      <h3>{{ editingId ? "Editar Volante" : "Novo Volante" }}</h3>

      <label class="label">Código *</label>
      <input v-model="codigo" class="input" placeholder="Ex: EVR11" />

      <label class="label">Descrição *</label>
      <input
        v-model="descricao"
        class="input"
        placeholder="Ex: VOL GM ONIX AB - APLIQUE"
      />

      <div class="form-actions">
        <button @click="salvar" class="btn-primary">
          {{ editingId ? "Salvar Alterações" : "Cadastrar Volante" }}
        </button>
        <button v-if="editingId" @click="resetForm" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>

    <!-- LISTA -->
    <div class="card list-card">
      <h3>Volantes Cadastrados</h3>

      <div v-if="loading">Carregando...</div>
      <div v-else-if="volantes.length === 0">Nenhum volante cadastrado.</div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th style="width: 140px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in volantes" :key="v.id">
            <td>{{ v.codigo }}</td>
            <td>{{ v.descricao }}</td>
            <td class="actions">
              <button @click="editar(v)" class="btn-small">Editar</button>
              <button @click="remover(v)" class="btn-small danger">
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="exportToCsv">Exportar para Excel (CSV)</button>
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
  background: #1e88e5;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
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

.btn-voltar {
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

.btn-voltar:hover {
  background: #ffebee;
}
</style>