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
          <a href="#features" class="nav-link">Funcionalidades</a>
          <a href="#how-it-works" class="nav-link">Como funciona</a>
          <a href="#contact" class="nav-link">Contato</a>

          <!-- Botão de login no header -->
          <RouterLink to="/ev-volantes/login" class="btn btn-outline">
            Entrar
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="main">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-text">
          <span class="hero-badge">
            <img
              src="/ev_volantes_image.jpeg"
              alt="EV Volantes"
              class="hero-logo"
            />
            Plataforma EV Volantes
          </span>

          <h1>
            Gestão de volantes simples, rápida
            <span class="highlight">e feita para o seu negócio.</span>
          </h1>

          <p class="hero-subtitle">
            Centralize seus pedidos de impressão, controle clientes e acompanhe
            o andamento dos trabalhos em um único lugar. Menos planilha e
            WhatsApp, mais organização e previsibilidade.
          </p>

          <div class="hero-actions">
            <RouterLink to="/ev-volantes/login" class="btn btn-primary">
              Acessar sistema
            </RouterLink>
            <a href="#features" class="btn btn-secondary">
              Ver funcionalidades
            </a>
          </div>

          <p class="hero-note">
            Já é cliente? Clique em <strong>Acessar sistema</strong> para fazer login.
          </p>
        </div>

        <div class="hero-panel">
          <div class="panel-card">
            <div class="panel-header">
              <img
                src="/ev_volantes_image.jpeg"
                alt="EV Volantes"
                class="panel-logo"
              />
              <div>
                <h2>Área do cliente</h2>
                <p class="panel-subtitle">
                  Acesse seus pedidos com segurança e rapidez.
                </p>
              </div>
            </div>

            <p class="panel-text">
              Acompanhe seus pedidos, veja o status das impressões
              e registre novos pedidos em poucos cliques.
            </p>

            <ul class="panel-list">
              <li>✔ Meus pedidos em tempo real</li>
              <li>✔ Criação rápida de novos pedidos</li>
              <li>✔ Comunicação centralizada</li>
            </ul>

            <RouterLink
              to="/ev-volantes/login"
              class="btn btn-primary full-width"
            >
              Entrar na plataforma
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- FUNCIONALIDADES -->
      <section id="features" class="section">
        <div class="section-header">
          <h2>Funcionalidades principais</h2>
          <p>Tudo o que você precisa para organizar seus volantes.</p>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <h3>Gestão de pedidos</h3>
            <p>
              Cadastre, acompanhe e atualize pedidos de forma prática.
              Histórico completo e visão clara do que está em produção.
            </p>
          </div>

          <div class="feature-card">
            <h3>Painel do administrador</h3>
            <p>
              Controle usuários, volantes, pedidos e tenha visão geral
              do negócio com o painel administrativo.
            </p>
          </div>

          <div class="feature-card">
            <h3>Experiência do cliente</h3>
            <p>
              Seus clientes enxergam profissionalismo com uma área dedicada,
              com acesso seguro e interface simples.
            </p>
          </div>
        </div>
      </section>

      <!-- COMO FUNCIONA -->
      <section id="how-it-works" class="section section-alt">
        <div class="section-header">
          <h2>Como funciona na prática</h2>
        </div>

        <ol class="steps">
          <li>
            <strong>1. Seu cliente acessa o sistema</strong><br />
            Pelo link que você enviar (ex: <code>app.evvolantes.com.br</code>).
          </li>
          <li>
            <strong>2. Cria ou acompanha pedidos</strong><br />
            Ele consegue registrar novos pedidos e acompanhar o status.
          </li>
          <li>
            <strong>3. Você gerencia tudo no painel admin</strong><br />
            Organiza, atualiza status e controla o fluxo de trabalho.
          </li>
        </ol>
      </section>

      <!-- CONTATO -->
      <section id="contact" class="section">
        <div class="section-header">
          <h2>Fale com a EV Volantes</h2>
          <p>
            Quer testar, contratar ou tirar dúvidas? Entre em contato.
          </p>
        </div>

        <div class="contact-box">
          <p><strong>E-mail:</strong> contato@evvolantes.com.br</p>
          <p><strong>WhatsApp:</strong> (00) 00000-0000</p>
          <p class="contact-note">
            Esses dados são apenas placeholders, você pode trocar pelos reais.
          </p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>© {{ currentYear }} EV Volantes. Todos os direitos reservados.</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
:root {
  color-scheme: dark light;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top left, #0f172a, #020617);
  color: #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  overflow-x: hidden; /* evita scroll horizontal no mobile */
}

/* HEADER - agora com fundo branco */

.header {
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 20;
  background: #F2F2F2; /* 👈 fundo branco */
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
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #0f172a; /* texto escuro no header branco */
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  font-size: 0.9rem;
  color: #1f2933; /* link escuro */
  text-decoration: none;
  padding: 0.35rem 0.5rem;
  border-radius: 999px;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}

/* MAIN */

.main {
  flex: 1;
}

/* HERO */

.hero {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1rem 2rem;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.6);
  color: #e5e7eb;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}

.hero-logo {
  width: 35px;
  height: 20px;
  object-fit: cover;
}

.hero-text h1 {
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.hero-text .highlight {
  display: block;
  color: #38bdf8;
}

.hero-subtitle {
  color: #9ca3af;
  margin-bottom: 1.5rem;
  font-size: 0.98rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.hero-note {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* HERO PANEL */

.hero-panel {
  display: flex;
  justify-content: center;
}

.panel-card {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.7);
  max-width: 360px;
  width: 100%;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.panel-logo {
  width: 64px;
  height: 40px;
  object-fit: contain;
}

.panel-card h2 {
  font-size: 1.1rem;
  margin-bottom: 0.1rem;
}

.panel-subtitle {
  font-size: 0.8rem;
  color: #9ca3af;
}

.panel-text {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.panel-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: #e5e7eb;
}

.panel-list li + li {
  margin-top: 0.35rem;
}

/* SECTIONS */

.section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-alt {
  background: radial-gradient(circle at top left, #020617, #020617);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.section-header h2 {
  font-size: 1.4rem;
  margin-bottom: 0.25rem;
}

.section-header p {
  font-size: 0.95rem;
  color: #9ca3af;
}

/* FEATURE GRID */

.feature-grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

.feature-card {
  border-radius: 0.75rem;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.feature-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.9rem;
  color: #9ca3af;
}

/* STEPS */

.steps {
  margin-top: 1.5rem;
  padding-left: 1.25rem;
  color: #e5e7eb;
}

.steps li {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

/* CONTATO */

.contact-box {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.9);
  font-size: 0.95rem;
}

.contact-note {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

/* BUTTONS */

.btn {
  border-radius: 999px;
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: background 0.15s, color 0.15s, transform 0.05s, box-shadow 0.05s;
  white-space: normal; /* permite quebrar linha */
  box-sizing: border-box; /* conta padding dentro da largura */
}

.btn-primary {
  background: #38bdf8;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4);
}

.btn-primary:hover {
  background: #0ea5e9;
  transform: translateY(-1px);
}

.btn-secondary {
  border: 1px solid rgba(148, 163, 184, 0.6);
  color: #e5e7eb;
  background: transparent;
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.15);
}

.btn-outline {
  border: 1px solid rgba(15, 23, 42, 0.2);
  padding-inline: 1rem;
  color: #0f172a; /* botão escuro no header branco */
  background: transparent;
}

.btn-outline:hover {
  background: rgba(15, 23, 42, 0.06);
}

.full-width {
  width: 100%;
}

/* garante que no card o botão nunca ultrapasse */
.panel-card .btn {
  max-width: 100%;
}

/* FOOTER */

.footer {
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  padding: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: #9ca3af;
}

/* RESPONSIVO - MOBILE COMUM (até 768px) */

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .nav {
    width: 100%;
    justify-content: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .hero {
    grid-template-columns: minmax(0, 1fr); /* 1 coluna no mobile */
    padding: 1.5rem 1rem 1.5rem;
  }

  .hero-text h1 {
    font-size: 1.6rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .hero-panel {
    margin-top: 1.5rem;
    width: 100%;
  }

  .panel-card {
    max-width: 100%;
    padding: 1.25rem 1rem;
  }

  .panel-logo {
    width: 48px;
    height: auto;
  }

  .btn {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
}

/* RESPONSIVO - CELULAR PEQUENO (até 480px) */

@media (max-width: 480px) {
  .hero-text h1 {
    font-size: 1.4rem;
  }

  .hero-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }

  .hero-logo {
    width: 28px;
    height: auto;
  }

  .panel-card {
    padding: 1rem 0.9rem;
  }

  .btn {
    font-size: 0.8rem;
    padding: 0.45rem 0.9rem;
  }
}

/* DESKTOP MAIOR */

@media (min-width: 900px) {
  .hero-text h1 {
    font-size: 2.3rem;
  }

  .feature-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>