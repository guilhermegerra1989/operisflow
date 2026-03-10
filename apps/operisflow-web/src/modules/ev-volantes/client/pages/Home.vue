<template>
  <div class="page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo-area">
          <img
            src="/ev_volantes_image.jpeg"
            alt="EV Volantes"
            class="logo"
          />
          <span class="brand-name">EV Volantes</span>
        </div>

        <nav class="nav">
          <a href="#sobre" class="nav-link">Sobre</a>
          <a href="#fotos" class="nav-link">Produtos</a>
          <a href="#contact" class="nav-link">Contato</a>

          <RouterLink to="/ev-volantes/login" class="btn-outline">
            Entrar
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-text">
          <h1>
            Volantes automotivos revisados, confiáveis
            <span class="highlight">para atacado, varejo e base de troca.</span>
          </h1>

          <p class="hero-subtitle">
            Atuamos fornecendo volantes completos e revisados com alto padrão
            de qualidade. Atendemos oficinas, lojistas, mecânicas e clientes
            finais que buscam segurança e acabamento impecável.
          </p>

          <div class="hero-actions">
            <a href="#fotos" class="btn-primary">Conheça nossos produtos</a>
            <a href="#sobre" class="btn-secondary">Quem somos</a>
          </div>
        </div>

        <!-- FOTO / BANNER -->
        <div class="hero-image">
          <div>
            <img
              src="/ev_volantes.jpeg"
              alt="EV Volantes"
              class="logo-brand"
            />
          </div>
        </div>
      </section>

      <!-- SOBRE A EMPRESA -->
      <section id="sobre" class="section">
        <div class="section-header">
          <h2>Sobre a EV Volantes</h2>
          <p>Excelência em volantes automotivos com qualidade e confiança.</p>
        </div>

        <p class="sobre-text">
          A EV Volantes é uma empresa especializada na venda de volantes
          automotivos no atacado, varejo e base de troca. Trabalhamos com
          peças revisadas, limpas e prontas para entrega, priorizando sempre a
          segurança e a satisfação do cliente.
          <br /><br />
          Cada volante passa por uma inspeção completa, garantindo acabamento,
          durabilidade e funcionamento perfeito. Nosso compromisso é entregar
          produtos de alto padrão com agilidade e atendimento diferenciado.
        </p>
      </section>

      <!-- GALERIA DE FOTOS -->
      <section id="fotos" class="section section-alt">
        <div class="section-header">
          <h2>Galeria de Produtos</h2>
          <p>Volantes esportivos, originais e modelos para troca</p>
        </div>

        <div class="galeria-grid">
          <div class="foto-card">
            <img
              src="/volante_1.jpeg"
              alt="Volante 1"
            />
          </div>

          <div class="foto-card">
            <img
              src="/volante_2.jpeg"
              alt="Volante 2"
            />
          </div>

          <div class="foto-card">
            <img
              src="/volante_3.jpeg"
              alt="Volante 3"
            />
          </div>
        </div>
      </section>

      <!-- CONTATO -->
      <section id="contact" class="section">
        <div class="section-header">
          <h2>Contato</h2>
          <p>Entre em contato para pedidos, dúvidas e informações.</p>
        </div>

        <div class="contact-box">
          <p><strong>E-mail:</strong> comercial@evvolantes.com.br</p>
          <p><strong>WhatsApp:</strong> (12) 98266-9702</p>
          <p class="contact-note">
            Estamos à disposição para atender sua necessidade.
          </p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 EV Volantes. Todos os direitos reservados.</span>
    </footer>
  </div>
</template>

<style scoped>
:root { color-scheme: dark light; }

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top left, #0f172a, #020617);
  color: #e5e7eb;
  font-family: system-ui, sans-serif;
  overflow-x: hidden;
}

/* HEADER */
.header {
  background: #F2F2F2;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  width: 50px;
  height: 36px;
  object-fit: contain;
}

.brand-name {
  color: #0f172a;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: #0f172a;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 6px;
}

.nav-link:hover {
  background: rgba(0,0,0,0.08);
}

/* BOTÃO ENTRAR */
.btn-outline {
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.9rem;
  background: #0f172a;
  color: #fff;
  border: none;
  font-weight: 600;
  transition: 0.2s ease-in-out;
}

.btn-outline:hover {
  background: #1e293b;
  transform: translateY(-2px);
}

/* MAIN / HERO */
.hero {
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 1rem 3rem;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 2rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 2.2rem;
  line-height: 1.3;
}

.highlight {
  color: #38bdf8;
  display: block;
}

.hero-subtitle {
  margin: 1rem 0 1.5rem;
  color: #cbd5e1;
}

.hero-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

/* Botões principais hero */
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.9rem;
  transition: 0.2s ease-in-out;
}

.btn-primary {
  background: #38bdf8;
  color: #0f172a;
}

.btn-primary:hover {
  background: #0ea5e9;
  transform: translateY(-1px);
}

.btn-secondary {
  border: 1px solid #38bdf8;
  color: #38bdf8;
  background: transparent;
}

.btn-secondary:hover {
  background: rgba(56, 189, 248, 0.1);
  transform: translateY(-1px);
}

/* FOTO BANNER */
.hero-image {
  display: flex;
  justify-content: center;
}

.hero-photo-placeholder {
  width: 260px;
  height: 250px;
  border-radius: 12px;
  border: 2px dashed #475569;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-brand {
  width: 260px;
  height: 250px;
  object-fit: contain;
}

/* SECTIONS */
.section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.section-alt {
  background: #111827;
}

.section-header {
  margin-bottom: 1.5rem;
}

.sobre-text {
  color: #cbd5e1;
  line-height: 1.6;
}

/* GALERIA + ANIMAÇÃO */
.galeria-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.foto-card {
  width: 100%;
  aspect-ratio: 1 / 1;              /* card quadrado */
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #334155;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.5);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.foto-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;              /* mostra o volante inteiro */
  object-position: center;
  transition: transform 0.25s ease;
}

/* Hover: levanta card + zoom leve */
.foto-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.8);
}

.foto-card:hover img {
  transform: scale(1.05);
}

/* Animação de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.galeria-grid .foto-card:nth-child(1) {
  animation: fadeInUp 0.5s ease-out 0s both;
}

.galeria-grid .foto-card:nth-child(2) {
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

.galeria-grid .foto-card:nth-child(3) {
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

/* CONTATO */
.contact-box {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 1.5rem;
  border-radius: 10px;
}

.contact-note {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* FOOTER */
.footer {
  background: #F2F2F2;
  color: #0f172a;
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
}

/* RESPONSIVO MOBILE */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    text-align: center;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-image {
    margin-top: 1.5rem;
  }

  .logo-brand {
    width: 200px;
    height: 200px;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>