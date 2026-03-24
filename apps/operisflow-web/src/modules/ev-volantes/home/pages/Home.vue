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
      <section class="hero hero-refinado">

        <div class="hero-text">
          <h1 class="hero-titulo"> <span class="hero-destaque">EV Volantes automotivos </span>
              </h1>      

          <p class="hero-subtitulo">
            Atuamos fornecendo volantes completos e revisados com alto padrão
            de qualidade. Atendemos oficinas, lojistas, mecânicas e clientes
            finais que buscam segurança e acabamento impecável.
          </p>

          <div class="hero-botoes">
            <a href="#fotos" class="btn-hero-primary">Conheça nossos produtos</a>
            <a href="#sobre" class="btn-hero-secondary">Quem somos</a>
          </div>
        </div>

        <div class="hero-imagem">
          <img
            src="/ev_volantes.jpeg"
            alt="EV Volantes"
            class="hero-banner"
          />
        </div>

      </section>
      




      <!-- SOBRE A EMPRESA -->
      <section id="sobre" class="section sobre-elegante">
  
        <div class="sobre-intro">
          <h2 class="title-gradient">Sobre a EV Volantes</h2>
          <p class="subtitle">Excelência em volantes automotivos com qualidade e confiança.</p>

          <p class="sobre-descricao">
            A EV Volantes é uma empresa especializada na venda de volantes
            automotivos no atacado, varejo e base de troca. Trabalhamos com
            peças revisadas, limpas e prontas para entrega, priorizando sempre a
            segurança e a satisfação do cliente.<br/><br/>
            Cada volante passa por uma inspeção completa, garantindo acabamento,
            durabilidade e funcionamento perfeito. Nosso compromisso é entregar
            produtos de alto padrão com agilidade e atendimento diferenciado.
          </p>
        </div>

        <div class="cards-container">

          <div class="card-info">
            <h3>Missão</h3>
            <p>Fornecer os melhores produtos comprometidos com a qualidade única e rara no mercado de volantes.</p>
          </div>

          <div class="card-info">
            <h3>Visão</h3>
            <p>Ser o melhor no mercado de volantes, visando sempre a melhoria contínua. Oferecer para os nossos clientes a segurança em adquirir um produto de qualidade e durabilidade.</p>
          </div>

          <div class="card-info">
            <h3>Valores</h3>
            <p>Transparência - respeito - credibilidade - honestidade - confiança.</p>
          </div>

        </div>

      </section>

      <!-- GALERIA DE FOTOS -->
      <section id="fotos" class="section section-alt">
        <div class="section-header">
          <h2>Galeria de Produtos</h2>
          <p></p>
        </div>

        <div class="galeria-grid">
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR11.png" alt="EVR11" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR12.png" alt="EVR12" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR13.png" alt="EVR13" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR14.png" alt="EVR14" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR15.png" alt="EVR15" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR16.png" alt="EVR16" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR17.png" alt="EVR17" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR18.png" alt="EVR18" /></div>
          <div class="foto-card"> <img src="/volantes/CHEVROLET/EVR19.png" alt="EVR19" /></div>

          
          <div class="foto-card"> <img src="/volantes/FIAT/EVR21.png" alt="EVR21" /></div>
          <div class="foto-card"> <img src="/volantes/FIAT/EVR22.png" alt="EVR22" /></div>
          <div class="foto-card"> <img src="/volantes/FIAT/EVR23.png" alt="EVR23" /></div>
          <div class="foto-card"> <img src="/volantes/FIAT/EVR24.png" alt="EVR24" /></div>

        
          <div class="foto-card"> <img src="/volantes/FORD/EVR31.png" alt="EVR31" /></div>
          <div class="foto-card"> <img src="/volantes/FORD/EVR32.png" alt="EVR32" /></div>
          <div class="foto-card"> <img src="/volantes/FORD/EVR33.png" alt="EVR33" /></div>


          <div class="foto-card"> <img src="/volantes/HYUNDAI/EVR61.png" alt="EVR61" /></div>


          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR51.png" alt="EVR51" /></div>
          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR52.png" alt="EVR52" /></div>
          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR53.png" alt="EVR53" /></div>
          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR54.png" alt="EVR54" /></div>
          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR55.png" alt="EVR55" /></div>
          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR56.png" alt="EVR56" /></div>
          <div class="foto-card"> <img src="/volantes/VOLKSWAGEN/EVR57.png" alt="EVR57" /></div>


          <div class="foto-card"> <img src="/volantes/RENAULT/EVR41.png" alt="EVR41" /></div>
          <div class="foto-card"> <img src="/volantes/RENAULT/EVR42.png" alt="EVR42" /></div>


          <div class="foto-card"> <img src="/volantes/MERCEDES/EVR71.png" alt="EVR71" /></div>
          <div class="foto-card"> <img src="/volantes/MERCEDES/EVR72.png" alt="EVR72" /></div>

        </div>
      </section>

      <!-- CONTATO -->
      <section id="contact" class="section">
        <div class="section-header">
          <h2>Contato</h2>
          <p>Entre em contato para pedidos, dúvidas e informações.</p>
        </div>

        <div class="contact-box">
          <p><strong>E-mail:</strong> administracao@evvolantes.com.br</p>
          <p><strong>WhatsApp:</strong> (12) 98266-9702</p>
          <p>
            <a href="https://www.instagram.com/ev.volantes" class="insta-link" target="_blank">
              <svg
                class="insta-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 
                0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 
                12 4.505 4.505 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.503 2.503 0 0 1 12 
                9.5zm4.75-.88a1.12 1.12 0 1 1-1.12 1.12 1.12 1.12 0 0 1 1.12-1.12z"/>
              </svg>
              @ev.volantes
            </a>
          </p>

          
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

  /* Gradiente base azul escuro */
  background:
    radial-gradient(circle at top left, #0f172a, #020617);
  color: #e5e7eb;
  font-family: system-ui, sans-serif;
  overflow-x: hidden;

  position: relative;        /* importante pro overlay funcionar */
  isolation: isolate;        /* garante que o ::before não vaze */
}

.page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;

  background-image:
    url("/back-volantes-esportivos.jpg"),
    radial-gradient(circle at top left, #0f172a, #020617);
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center center;
  background-size: cover, cover;

  opacity: 0.18;
  filter: saturate(0.7) contrast(0.9);
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
  background: #5e72a8;
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
  background: rgba(15, 23, 42, 0.88); /* quase sólido, mas deixa o fundo respirar */
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

.insta-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #38bdf8;
  text-decoration: none;
  font-weight: 500;
}

.insta-link:hover {
  color: #0ea5e9;
}

.insta-icon {
  color: #38bdf8;
  transition: 0.2s;
}

.insta-link:hover .insta-icon {
  color: #0ea5e9;
  transform: scale(1.1);
}

/* SECTION SOBRE — Estilo Premium */
.sobre-elegante {
  margin-top: 2rem;
}

.sobre-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2.5rem auto;
}

.title-gradient {
  font-size: 2.2rem;
  background: linear-gradient(to right, #38bdf8, #0ea5e9);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: 700;
}

.subtitle {
  color: #94a3b8;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.sobre-descricao {
  margin-top: 1.5rem;
  color: #cbd5e1;
  line-height: 1.7;
  font-size: 1rem;
}

/* Cards de Missão / Visão / Valores */
.cards-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-top: 3rem;
}

.card-info {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 1.8rem;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card-info h3 {
  color: #38bdf8;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.card-info p {
  color: #cbd5e1;
  line-height: 1.5;
}

/* Hover elegante */
.card-info:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  border-color: #38bdf8;
}



/* HERO REFINADO */
.hero-refinado {
  max-width: 1120px;
  margin: 0 auto;
  padding: 4rem 1rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* Texto */
.hero-titulo {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.2;
  color: #e2e8f0;
}

.hero-destaque {
  display: block;
  color: #38bdf8;
  font-weight: 800;
  font-size: 1.9rem;
  margin-top: 6px;
}

.hero-subtitulo {
  margin-top: 1rem;
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 520px;
}

/* Botões */
.hero-botoes {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.btn-hero-primary,
.btn-hero-secondary {
  padding: 12px 26px;
  font-size: 1rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s ease;
}

.btn-hero-primary {
  background: #38bdf8;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(14,165,233,0.35);
}

.btn-hero-primary:hover {
  background: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(14,165,233,0.45);
}

.btn-hero-secondary {
  border: 2px solid #38bdf8;
  color: #38bdf8;
  background: transparent;
}

.btn-hero-secondary:hover {
  background: rgba(56, 189, 248, 0.12);
  transform: translateY(-2px);
}

/* Imagem */
.hero-imagem {
  display: flex;
  justify-content: center;
}

.hero-banner {
  width: 260px;
  height: auto;
  filter: drop-shadow(0 10px 28px rgba(0,0,0,0.55));
  transition: transform .25s ease;
}

.hero-imagem:hover .hero-banner {
  transform: scale(1.03);
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .hero-refinado {
    flex-direction: column-reverse;
    text-align: center;
    padding: 2.5rem 1rem 2.5rem;
  }

  .hero-titulo {
    font-size: 1.9rem;
  }

  .hero-destaque {
    font-size: 1.45rem;
  }

  .hero-subtitulo {
    font-size: 0.95rem;
    margin: 0.8rem auto;
  }

  .hero-botoes {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-banner {
    width: 200px;
  }
}

</style>