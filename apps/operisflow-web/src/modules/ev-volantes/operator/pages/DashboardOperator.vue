<script setup lang="ts">

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/ev-volantes/login";
}

</script>

<template>
  <div class="page">
    <div class="container">
    <!-- HEADER COM NOME E LOGOUT -->
    <div class="top-bar">
      <img
        src="../../../../assets/ev_volantes_image.png"
        alt="EV Volantes"
        class="logo"
      />
      <button class="btn-logout" @click="logout">Sair</button>
    </div>

    <h2>Dashboard</h2>

    <!-- GRID DE BOTÕES / CARDS PRINCIPAIS -->
    <div class="menu-grid">
      <router-link to="/ev-volantes/operator/estoque" class="btn menu-card">
        <h3>Estoque</h3>
        <p>Visualizar pedidos Abertos</p>
      </router-link> 
    </div>
  </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;

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
  position: relative;

  overflow: hidden;

  max-width: 1200px;

  margin: 0 auto;

  padding: 32px;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 24px;

  transition: .35s ease;

  box-shadow:
    0 15px 40px rgba(0,0,0,.35);
}

.container::before {
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

.container:hover {

  transform: translateY(-4px);

  border-color: #004BFF;

  box-shadow:
    0 18px 45px rgba(0,75,255,.25);
}

/* Topo */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 30px;
}

.logo {
  height: 60px;

  object-fit: contain;

  filter:
    brightness(0)
    invert(1);
}

.btn-logout {
  width: auto;
  min-width: unset;

  padding: 4px 10px;

  font-size: 12px;

  border-radius: 8px;

  background: transparent;

  border: 1px solid rgba(239,68,68,.35);

  color: #f87171;
}

.btn-logout:hover {
  background: rgba(239,68,68,.15);

  border-color: #ef4444;

  color: white;

  box-shadow:
    0 0 20px rgba(239,68,68,.15);
}

h2 {
  color: white;

  text-align: center;

  font-size: 2rem;

  margin-bottom: 32px;
}

/* Grid de menu – bom em PC, quebra em mobile */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.menu-card {
  display: block;

  text-decoration: none;

  padding: 24px;

  border-radius: 18px;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.08);

  color: white;

  transition: .25s;

  box-shadow:
    0 8px 20px rgba(0,0,0,.15);
}

.menu-card:hover {

  transform: translateY(-4px);

  border-color: #004BFF;

  background: rgba(0,75,255,.12);

  box-shadow:
    0 15px 35px rgba(0,75,255,.25);
}

.menu-card h3 {
  margin: 0 0 10px;

  color: white;

  font-size: 20px;
}

.menu-card p {
  margin: 0;

  color: #94a3b8;

  font-size: 14px;

  font-weight: 400;
}

</style>