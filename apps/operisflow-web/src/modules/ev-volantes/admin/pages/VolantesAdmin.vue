<script setup lang="ts">
import { ref,onMounted, nextTick, computed } from "vue";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../api/apiClient";

const token = localStorage.getItem("token") ?? "";

type Marca = {
  id: string;
  nome: string;
  descricao?: string;
};

type Volante = {
  id: string;
  codigo: string;
  descricao: string;
  img: string;
  marcaId: string;       
   marcaNome?: string | null;
};


// Dados vindos da API
const marcas = ref<Marca[]>([]);
const volantes = ref<Volante[]>([]);
const loading = ref(false);
const error = ref("");

// formulário
const editingId = ref<string | null>(null);
const codigo = ref("");
const descricao = ref("");
const img = ref("");
const marca = ref(""); // id da marca selecionada


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

const logoMarcas: Record<string, string> = {
  "Chevrolet": "/marcas/chevrolet.png",
  "Fiat": "/marcas/fiat.png",
  "Ford": "/marcas/ford.png",
  "Renault": "/marcas/renault.png",
  "Volkswagen": "/marcas/volkswagen.png",
  "Hyundai": "/marcas/hyundai.png",
  "Mercedes-Benz": "/marcas/mercedes.png",
};

// Helper para mapear volantes vindo da API
function mapVolantes(volantesResponse: any[]): Volante[] {
  return volantesResponse.map((v: any) => {
    const marcaId = v.marca_id ?? v.marcaId;
    const marcaObj = marcas.value.find((m: any) => m.id === marcaId);

    return {
      id: v.id,
      codigo: v.codigo,
      descricao: v.descricao,
      img: v.img,
      marcaId,
      marcaNome: marcaObj?.nome ?? null,
    };
  });
}

const itensAgrupados = computed(() => {
  const grupos: Record<string, any> = {};

  volantes.value.forEach((it) => {
    if (!grupos[it.marcaId]) {
      grupos[it.marcaId] = {
        marcaNome: it.marcaNome,
        itens: [],
      };
    }
    grupos[it.marcaId].itens.push(it);
  });

  return grupos;
});

const marcasAbertas = ref<string[]>([]);

function toggleMarca(id: string) {
  if (marcasAbertas.value.includes(id)) {
    marcasAbertas.value = marcasAbertas.value.filter(m => m !== id);
  } else {
    marcasAbertas.value.push(id);
  }
}

async function loadVolantes() {
  try {
    loading.value = true;
    error.value = "";

    const volantesResponse = await apiGet("/volantes", token);
    volantes.value = mapVolantes(volantesResponse);

  } catch (e: any) {
    error.value = "Erro ao carregar volantes";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const [marcasResponse, volantesResponse] = await Promise.all([
    apiGet("/marcas", token),
    apiGet("/volantes", token),
  ]);

  marcas.value = marcasResponse;
  volantes.value = mapVolantes(volantesResponse);
});

// limpar formulário
function resetForm() {
  editingId.value = null;
  codigo.value = "";
  descricao.value = "";
  img.value = "";
  marca.value = ""; // limpa marca selecionada
}

// criar ou atualizar
async function salvar() {
  if (!codigo.value || !descricao.value) {
    alert("Código e descrição são obrigatórios.");
    return;
  }

  if (!marca.value) {
    alert("Marca é obrigatória.");
    return;
  }

  try {
    const payload = {
      codigo: codigo.value,
      descricao: descricao.value,
      img: img.value,
      marca_id: marca.value, // importante: enviar a marca para o backend
    };

    if (editingId.value) {
      await apiPatch(`/volantes/${editingId.value}`, token, payload);
    } else {
      await apiPost("/volantes", token, payload);
    }

    resetForm();
    await loadVolantes();
  } catch (e: any) {
    error.value = "Erro ao salvar volante";
    console.error(e);
  }
}

// clicar em editar
async function editar(v: Volante) {
  editingId.value = v.id;
  codigo.value = v.codigo;
  descricao.value = v.descricao;
  img.value = v.img;
  marca.value = v.marcaId; // preenche select com a marca do volante

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
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(";")
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

    <h2>Catálogo de Volantes</h2>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- FORMULÁRIO -->
    <div class="card form-card" :class="{ editing: editingId }" ref="formRef">
      <h3>{{ editingId ? "Editar Volante" : "Novo Volante" }}</h3>

      <label class="label">Código *</label>
      <input
        v-model="codigo"
        class="input"
        placeholder="Ex: EVR11"
        ref="codigoInputRef"
      />

      <label class="label">Descrição *</label>
      <input
        v-model="descricao"
        class="input"
        placeholder="Ex: VOL GM ONIX AB - APLIQUE"
      />

      <label class="label">Imagem *</label>
      <input
        v-model="img"
        class="input"
        placeholder="Ex: /volantes/VOLKSWAGEN"
      />

      <!-- CAMPO DE MARCA -->
      <label class="label">Marca *</label>
      <select v-model="marca" class="input">
        <option value="">Selecione a marca</option>
        <option v-for="m in marcas" :key="m.id" :value="m.id">
          {{ m.nome }}
        </option>
      </select>

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

      <div v-else class="marcas-lista">
        <div
          class="marca-group"
          v-for="(grupo, marcaId) in itensAgrupados"
          :key="marcaId"
        >
          <div class="marca-header" @click="toggleMarca(marcaId)">
            <div class="marca-info">
              <!-- LOGO DA MARCA -->
              <img
                class="marca-logo"
                :src="logoMarcas[grupo.marcaNome]"
                :alt="grupo.marcaNome"
              />
              <span>{{ grupo.marcaNome }}</span>
            </div>

            <span class="seta">
              {{ marcasAbertas.includes(marcaId) ? "▲" : "▼" }}
            </span>
          </div>

          <transition name="fade">
            <div class="volantes" v-if="marcasAbertas.includes(marcaId)">
              <table class="table">
                <tbody>
                  <tr v-for="v in grupo.itens" :key="v.id">
                    <td>
                      <img :src="v.img" :alt="v.codigo" />
                    </td>
                    <td>{{ v.codigo }}</td>
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
          </transition>
        </div>
      </div>
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

.table td img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  margin: 0 auto;
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
  background: #465684;
}

.logo {
  height: 36px;
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

.marcas-lista {
  margin-top: 12px;
}

.marca-group {
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
}

.marca-header {
  padding: 12px;
  background: #f7f7f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.marca-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.marca-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.seta {
  opacity: 0.6;
  font-size: 14px;
}

.volantes {
  padding: 10px 12px;
  background: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>