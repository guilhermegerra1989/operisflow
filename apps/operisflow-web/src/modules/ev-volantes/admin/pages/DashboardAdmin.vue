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
onMounted(async () => {
  pedidos.value = await apiGet("/orders/my");
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

</script>

<template>



  <div class="page">
      <div class="container">

        <div class="card-dashboard">

          <div class="top-bar">
            <button class="btn-back-mobile" @click="logout">
              ←
            </button>

            <img src="../../../../assets/ev_volantes_image.png"
              alt="EV Volantes"
              class="logo"
            />

            <button class="btn-secondary btn-small desktop-only" @click="logout">
              Sair
            </button>
          </div>

          <h2>Painel Administrativo</h2>

            <!-- GRID DE BOTÕES / CARDS PRINCIPAIS -->
          <div class="menu-grid">
            <router-link to="/ev-volantes/admin/users" class="btn menu-card">
              <h3>Usuários</h3>
              <p>Gerenciar clientes e administradores</p>
            </router-link>

            <router-link to="/ev-volantes/admin/volantes" class="btn menu-card">
              <h3>Tipos de Volantes</h3>
              <p>Configurar tipos de volantes disponíveis</p>
            </router-link>

            <router-link to="/ev-volantes/admin/pedidos" class="btn menu-card">
              <h3>Pedidos</h3>
              <p>Visualizar todos os pedidos dos clientes</p>
            </router-link>

            <router-link to="/ev-volantes/admin/rotas" class="btn menu-card">
              <h3>Rotas</h3>
              <p>Visualizar/Configurar Rotas disponíveis</p>
            </router-link>

            <router-link to="/ev-volantes/admin/marcas" class="btn menu-card">
              <h3>Marcas</h3>
              <p>Visualizar/Configurar Marcas disponíveis</p>
            </router-link>

            <router-link to="/ev-volantes/admin/estoque" class="btn menu-card">
              <h3>Estoque</h3>
              <p>Visualizar/Exportar Estoque para pedidos</p>
            </router-link>
          </div>

      </div>
    </div>
  </div>


</template>

<style scoped>
.page {
  min-height: 100vh;

  display: flex;
  align-items: center;
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
}

.card-dashboard {
  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 24px;

  padding: 32px;

  transition: .35s ease;

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);
}

.card-dashboard::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0,75,255,.08),
      transparent 40%
    );

  pointer-events: none;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
}

.logo {
  height: 55px;

  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
}

h2 {
  color: white;

  text-align: center;

  margin-bottom: 30px;

  font-size: 2rem;
}

.btn-logout {
  background: transparent;

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 10px 16px;

  border-radius: 10px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-logout:hover {
  background: rgba(0,75,255,.12);

  color: white;
}


.menu-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px, 1fr)
    );

  gap: 20px;
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

.menu-card {
  display: flex;
  flex-direction: column;

  gap: 10px;

  padding: 24px;

  text-decoration: none;

  border-radius: 18px;

  background:
    rgba(255,255,255,.04);

  border:
    1px solid rgba(255,255,255,.08);

  color: white;

  transition: .25s;
}

.menu-card:hover {
  transform: translateY(-5px);

  border-color: #004BFF;

  box-shadow:
    0 15px 30px rgba(0,75,255,.20);
}

.menu-card h3 {
  color: #ffffff;

  margin: 0;

  font-size: 1.1rem;
}

.menu-card p {
  margin: 0;

  color: #94a3b8;

  font-size: .9rem;

  font-weight: 400;
}

@media (max-width: 768px) {

  .page {
    padding: 16px;
  }

  .card-dashboard {
    padding: 22px;
  }

  .logo {
    height: 42px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }
}


.qty,
.empty,
.card,
.volante,
.volante strong,
.volante span,
.nf,
.title,
.desc,
.footer {
  
}

.btn-secondary {
  background: transparent;

  border: 2px solid #004BFF;

  color: #004BFF;

  padding: 10px 16px;

  border-radius: 10px;

  font-weight: 700;

  cursor: pointer;

  transition: .25s;
}

.btn-secondary:hover {
  background: rgba(0,75,255,.12);

  color: white;
}

.btn-small {
  width: auto;

  padding: 4px 10px;

  font-size: 0.75rem;

  border-radius: 8px;
}

.btn-back-mobile {
  display: none;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  border: 1px solid rgba(255,255,255,.15);

  background: rgba(255,255,255,.05);

  color: white;

  font-size: 20px;

  cursor: pointer;

  transition: .25s;
}

.btn-back-mobile:hover {
  background: rgba(0,75,255,.15);

  border-color: #004BFF;
}

.desktop-only {
  display: flex;
}

@media (max-width: 768px) {

  .top-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .btn-back-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .desktop-only {
    display: none;
  }

  .logo {
    height: 42px;
  }
}
</style>