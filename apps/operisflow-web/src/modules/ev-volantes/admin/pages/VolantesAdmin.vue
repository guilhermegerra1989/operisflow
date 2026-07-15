<script setup lang="ts">
import { ref,onMounted, nextTick, computed } from "vue";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../api/apiClient";

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
  tipo: TipoVolante;
};


// Dados vindos da API
const marcas = ref<Marca[]>([]);
const volantes = ref<Volante[]>([]);
const loading = ref(false);
const error = ref("");

type TipoVolante = "volante" | "esportivo" | "acessorio";

// formulário
const editingId = ref<string | null>(null);
const codigo = ref("");
const descricao = ref("");
const img = ref("");
const marca = ref(""); // id da marca selecionada
const tipo = ref<TipoVolante | "">("");



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
      tipo: v.tipo,
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

    const volantesResponse = await apiGet("/volantes");
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
    apiGet("/marcas"),
    apiGet("/volantes"),
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
  tipo.value = "";
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

  if (!tipo.value) {
    alert("Tipo é obrigatório.");
    return;
  }

  try {
    const payload = {
      codigo: codigo.value,
      descricao: descricao.value,
      img: img.value,
      marca_id: marca.value, // importante: enviar a marca para o backend
      tipo: tipo.value
    };

    if (editingId.value) {
      await apiPatch(`/volantes/${editingId.value}`, payload);
    } else {
      await apiPost("/volantes", payload);
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
  tipo.value = v.tipo;

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
    await apiDelete(`/volantes/${v.id}`);
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
  
<div class="page">
  <div class="container">

    <div class="top-bar">
      <img
        src="../../../../assets/ev_volantes_image.png"
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

      <label class="label">Tipo *</label>
      <select v-model="tipo" class="input">
        <option value="">Selecione o tipo</option>
        <option value="volante">Volante</option>
        <option value="esportivo">Volante Esportivo</option>
        <option value="acessorio">Acessório</option>
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
      <h3>Itens Cadastrados</h3>

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
}


select option {
  background: #111;
  color: white;
}

.form-card {
  margin-bottom: 24px;
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

.table th,
.table td {
  color: #e2e8f0;

  border-bottom: 1px solid rgba(255,255,255,.05);
}
.table tr:hover {
  background: rgba(0,75,255,.05);
}

.table td img {
  width: 70px;
  height: 70px;

  object-fit: cover;

  border-radius: 12px;

  background: white;

  padding: 2px;
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
  background: #465684;
}

.logo {
  height: 55px;

  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
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
  height: 36px;
  object-fit: contain;
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
  border: 1px solid #004BFF;

  box-shadow:
    0 0 0 1px rgba(0,75,255,.4),
    0 0 25px rgba(0,75,255,.15);
}

.marcas-lista {
  margin-top: 12px;
}

.marca-group {
  border: 1px solid rgba(255,255,255,.06);

  border-radius: 16px;

  overflow: hidden;

  margin-bottom: 14px;

  background: rgba(255,255,255,.02);
}

.marca-header {
  padding: 14px 16px;

  background: rgba(255,255,255,.03);

  display: flex;

  justify-content: space-between;

  align-items: center;

  cursor: pointer;

  transition: .25s;
}

.marca-header:hover {
  background: rgba(0,75,255,.08);
}


.marca-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.marca-info span {
  color: #4d7cff;

  font-weight: 700;
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

  background: rgba(255,255,255,.02);
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

.card:hover {
  transform: translateY(-2px);

  border-color: #004BFF;

  box-shadow:
    0 0 0 1px rgba(0,75,255,.4),
    0 0 25px rgba(0,75,255,.20),
    0 10px 30px rgba(0,0,0,.35);
}
</style>