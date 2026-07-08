<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue'

const modalAberto = ref(false)
const indiceAtual = ref(0)
const imagens = ref<string[]>([])

function proxima() {
  indiceAtual.value =
    (indiceAtual.value + 1) %
    imagens.value.length
}

function anterior() {
  indiceAtual.value =
    (indiceAtual.value - 1 + imagens.value.length) %
    imagens.value.length
}

function handleKey(event: KeyboardEvent) {
  if (!modalAberto.value) return

  if (event.key === 'ArrowRight') {
    proxima()
  }

  if (event.key === 'ArrowLeft') {
    anterior()
  }

  if (event.key === 'Escape') {
    modalAberto.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})

const galerias = {
  CHEVROLET: [
    '/volantes_esportivos/CHEVROLET/cruze_universal_azul.png',
    '/volantes_esportivos/CHEVROLET/tracker_controle_universal.png',
    '/volantes_esportivos/CHEVROLET/volante_gti_vision.png',
    '/volantes_esportivos/CHEVROLET/cruze_universal_branco.png',
    '/volantes_esportivos/CHEVROLET/cruze_universal_vermelho.png',
    '/volantes_esportivos/CHEVROLET/tracker_aplique_universal.png',
    '/volantes_esportivos/CHEVROLET/tracker_controle_led_alma_corsa_celta.png',
    '/volantes_esportivos/CHEVROLET/volante_black.png'
  ],

  VOLKSWAGEN: [
    '/volantes_esportivos/VOLKSWAGEN/nivus_controle_universal.png',
    '/volantes_esportivos/VOLKSWAGEN/novo_golf.png',
    '/volantes_esportivos/VOLKSWAGEN/volante_gti_vision.png',
    '/volantes_esportivos/VOLKSWAGEN/gol_g5_original.png',
    '/volantes_esportivos/VOLKSWAGEN/nivus_universal.png',
    '/volantes_esportivos/VOLKSWAGEN/volante_esportivo_rallye.png'
  ],

  FIAT: [
    '/volantes_esportivos/FIAT/volante_fire_original.png',
    '/volantes_esportivos/FIAT/toro_black_alma_original.png',
    '/volantes_esportivos/FIAT/volante_gti_vision.png',
    '/volantes_esportivos/FIAT/volante_palio_novo.png',
    '/volantes_esportivos/FIAT/volante_rallye.png',
    '/volantes_esportivos/FIAT/pulse_black_alma_original.png',
    '/volantes_esportivos/FIAT/palio_novo_azul.png',
    '/volantes_esportivos/FIAT/nivus_aplique_universal.png'
  ],

  FORD: [
    '/volantes_esportivos/FORD/volante_ford.png',
    '/volantes_esportivos/FORD/volante_gti_vision_ford_ka.png',
    '/volantes_esportivos/FORD/volante_rallye_ford.png'
  ]
} as const

type Marca = keyof typeof galerias

function abrirGaleria(marca: Marca) {
  imagens.value = [...galerias[marca]]
  indiceAtual.value = 0
  modalAberto.value = true
}


</script>

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
          <h1 class="hero-titulo"> <span class="hero-destaque">EV Volantes | Alta Performance e Estética Automotiva </span>
              </h1>      

          <p class="hero-subtitulo">
            Atuamos fornecendo volantes completos e revisados com alto padrão
            de qualidade. Atendemos oficinas, lojistas, mecânicas e clientes
            finais que buscam segurança e acabamento impecável.
          </p>

          <div class="hero-botoes">
            <a href="#fotos" class="btn-hero-primary">Conheça nossos produtos</a>
            <a href="#sobre" class="btn-hero-secondary">Quem somos</a>
            <a href="#fazemos" class="btn-hero-secondary">O que fazemos</a>
            <!-- <a href="#diferencial" class="btn-hero-secondary">Linha Premium</a> -->
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
            A EV Volantes nasceu da paixão pelo universo automotivo e de uma inconformidade com o mercado. 
            Atuando inicialmente como distribuidores, percebemos que os produtos disponíveis não atingiam o nível de excelência que nossos clientes mereciam.<br/><br/>
            Em vez de aceitar o comum, decidimos ditar o padrão. 
            Assumimos o controle da produção para criar volantes que unem ergonomia superior, acabamento impecável e máxima segurança. 
            Hoje, somos referência na fabricação e distribuição de volantes automotivos.
          </p>
        </div>

        <div class="cards-container">

          <div class="card-info">
            <h3>🎯 Missão</h3>
            <p>Produzir e entregar volantes com um padrão de qualidade raro no mercado, unindo segurança viária e sofisticação estética.</p>
          </div>

          <div class="card-info">
            <h3>👁️ Visão</h3>
            <p>Consolidar-se como a principal referência nacional em volantes automotivos, impulsionada pela inovação contínua e pela confiança dos nossos parceiros.</p>
          </div>

          <div class="card-info">
            <h3>🤝 Valores</h3>
            <p>Segurança: Nosso pilar inegociável em cada peça produzida.</p>
            <p>Transparência: Relações comerciais claras e honestas.</p>
            <p>Credibilidade: Compromisso rigoroso com prazos e padrões de entrega.</p>
            <p>Respeito: Valorização de colaboradores, clientes e parceiros do setor.</p>
          </div>

        </div>

      </section>

       <!-- FAZEMOS NA EMPRESA -->
      <section id="fazemos" class="section sobre-elegante">


        <div class="cards-container">

          <div class="card-info">
            <h3>🛠️ O que fazemos</h3>
            <p style=" color: #94a3b8; margin-top: 0.5rem; font-size: 0.9rem;">
              Atendemos com agilidade, estoque a pronta-entrega e logística eficiente em três modalidades:
            </p>

            <p class="sobre-descricao">
            <b>- Atacado:</b> Distribuição em escala para lojistas e autopeças com condições comerciais competitivas.
            </p>
            <p class="sobre-descricao">
            <b>- Varejo:</b> Venda direta para o consumidor final que busca renovar o interior do veículo.
            </p>
            <p class="sobre-descricao">
            <b>- Base de Troca:</b> Solução sustentável e econômica para renovação imediata do seu volante.
            </p>
            
          </div>

          <div class="card-info">
            <h3>🏆 Diferenciais da Linha Premium</h3>
           <p style=" color: #94a3b8; margin-top: 0.5rem; font-size: 0.9rem;">
              O volante é o principal ponto de contato entre o motorista e o veículo. Por isso, nossa Linha Premium entrega:
          </p>

          <p class="sobre-descricao">
           <b>- Inspeção Rígida:</b> Cada peça passa por testes estruturais e de aderência antes do envio.
          </p>
          <p class="sobre-descricao">
           <b>- Pronto para Instalação:</b> Componentes entregues limpos, revisados e higienizados.
          </p>
          <p class="sobre-descricao">
           <b>- Materiais de Alta Resistência:</b> Injetados e revestimentos que suportam o desgaste diário e a exposição solar.
          </p>
          <p class="sobre-descricao">
           <b>- Design e Ergonomia:</b> Visual moderno que valoriza o interior do carro e melhora a pegada ao dirigir.
          </p>

          </div>

        </div>

      </section>

      <!-- GALERIA DE FOTOS -->
      <section id="fotos" class="section section-alt">
        <div class="section-header">
          <h2>Volantes Esportivos</h2>
          <p></p>
        </div>

        <div class="galeria-grid">
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> <img src="/marcas/chevrolet.png" alt="Chevrolet" /></div>
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> <img src="/volantes_esportivos/CHEVROLET/cruze_universal_azul.png" alt="Cruze" /></div>
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> <img src="/volantes_esportivos/CHEVROLET/tracker_controle_universal.png" alt="Tracker" /></div>
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> <img src="/volantes_esportivos/CHEVROLET/volante_gti_vision.png" alt="Gti" /></div>

          
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> <img src="/marcas/volkswagen.png" alt="Volkswagen" /></div>
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> <img src="/volantes_esportivos/VOLKSWAGEN/nivus_controle_universal.png" alt="Nivus" /></div>
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> <img src="/volantes_esportivos/VOLKSWAGEN/novo_golf.png" alt="Golf" /></div>
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> <img src="/volantes_esportivos/VOLKSWAGEN/volante_gti_vision.png" alt="Gti" /></div>


          <div class="foto-card" @click="abrirGaleria('FIAT')"> <img src="/marcas/fiat.png" alt="Fiat" /></div>
          <div class="foto-card" @click="abrirGaleria('FIAT')"> <img src="/volantes_esportivos/FIAT/volante_fire_original.png" alt="Fire" /></div>
          <div class="foto-card" @click="abrirGaleria('FIAT')"> <img src="/volantes_esportivos/FIAT/toro_black_alma_original.png" alt="Toro" /></div>
          <div class="foto-card" @click="abrirGaleria('FIAT')"> <img src="/volantes_esportivos/FIAT/volante_gti_vision.png" alt="Gti" /></div>


          <div class="foto-card" @click="abrirGaleria('FORD')"> <img src="/marcas/ford.png" alt="Ford" /></div>
          <div class="foto-card" @click="abrirGaleria('FORD')"> <img src="/volantes_esportivos/FORD/volante_ford.png" alt="Ford" /></div>
          <div class="foto-card" @click="abrirGaleria('FORD')"> <img src="/volantes_esportivos/FORD/volante_rallye_ford.png" alt="Ford Rallye" /></div>
          <div class="foto-card" @click="abrirGaleria('FORD')"> <img src="/volantes_esportivos/FORD/volante_gti_vision_ford_ka.png" alt="Ford Ka" /></div>

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
          <p>
            <strong>
              <svg viewBox="0 0 24 24" 
                  width="18"
                  height="18">
                <path
                  fill="currentColor"
                  d="M20.52 3.48A11.87 11.87 0 0012.06 0C5.6 0 .34 5.28.34 11.8c0 2.08.54 4.1 1.56 5.88L0 24l6.52-1.7a11.74 11.74 0 005.54 1.4h.01c6.46 0 11.72-5.28 11.72-11.8 0-3.15-1.22-6.1-3.27-8.42zm-8.46 18.1h-.01a9.8 9.8 0 01-5-1.36l-.36-.21-3.87 1.01 1.03-3.77-.24-.39a9.77 9.77 0 01-1.5-5.26c0-5.41 4.38-9.8 9.77-9.8 2.61 0 5.07 1.02 6.92 2.88a9.73 9.73 0 012.87 6.93c0 5.4-4.38 9.79-9.76 9.79zm5.45-7.32c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.52.08-.8.38-.28.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.1 4.48.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.13-.27-.2-.57-.35z"
                />
              </svg>
               <a href="https://wa.me/5512982669702?text=Olá! Vim pelo site e gostaria de mais informações."
                      target="_blank"
                      rel="noopener noreferrer" style="margin-left: 8px;color: cornflowerblue;" > (12) 98266-9702 </a>
            </strong> 
                  
          </p>
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

    <!-- WHATSAPP -->
    <a
      href="https://wa.me/5512982669702?text=Olá! Vim pelo site e gostaria de mais informações."
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-container"
    >
      <div class="whatsapp-button">
        <!-- SVG LIMPO -->
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.87 11.87 0 0012.06 0C5.6 0 .34 5.28.34 11.8c0 2.08.54 4.1 1.56 5.88L0 24l6.52-1.7a11.74 11.74 0 005.54 1.4h.01c6.46 0 11.72-5.28 11.72-11.8 0-3.15-1.22-6.1-3.27-8.42zm-8.46 18.1h-.01a9.8 9.8 0 01-5-1.36l-.36-.21-3.87 1.01 1.03-3.77-.24-.39a9.77 9.77 0 01-1.5-5.26c0-5.41 4.38-9.8 9.77-9.8 2.61 0 5.07 1.02 6.92 2.88a9.73 9.73 0 012.87 6.93c0 5.4-4.38 9.79-9.76 9.79zm5.45-7.32c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.52.08-.8.38-.28.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.1 4.48.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.13-.27-.2-.57-.35z"
          />
        </svg>
      </div>

      <span class="whatsapp-label">Fale conosco</span>
    </a>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 EV Volantes. Todos os direitos reservados.</span>
    </footer>


    <div v-if="modalAberto" class="modal-galeria" @click.self="modalAberto = false" >
        <button class="modal-fechar" @click="modalAberto = false" > ✕ </button>
        <button class="modal-nav modal-prev" @click="anterior">  ❮  </button>

        <img :src="imagens[indiceAtual]" class="modal">

        <button class="modal-nav modal-next" @click="proxima">   ❯  </button>
        <div class="modal-indicador"> {{ indiceAtual + 1 }} / {{ imagens.length }} </div>
    </div>


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
  /* background: rgba(15, 23, 42, 0.88);  */
  background: transparent; 
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
   background: transparent;
  /* background: #020617; */
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

.card-info-subtitle {
  color: #94a3b8;
  margin-top: 0.5rem;
  font-size: 1.1rem;
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

.whatsapp-container {
  position: fixed;
  bottom: 24px;
  right: 24px;

  display: flex;
  align-items: center;
  gap: 10px;

  text-decoration: none;
  z-index: 999;
}

.whatsapp-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;

  background: #25d366;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 12px 30px rgba(0,0,0,0.4);

  transition: all 0.25s ease;
}

/* SVG */
.whatsapp-button svg {
  width: 26px;
  height: 26px;
}

/* hover */
.whatsapp-button:hover {
  transform: scale(1.08);
  background: #1ebe5d;
}

/* label */
.whatsapp-label {
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;

  padding: 8px 12px;
  border-radius: 8px;

  font-size: 0.8rem;
  white-space: nowrap;

  opacity: 0;
  transform: translateX(10px);
  transition: 0.25s;
}

/* aparecer no hover */
.whatsapp-container:hover .whatsapp-label {
  opacity: 1;
  transform: translateX(0);
}

/* mobile */
@media (max-width: 768px) {
  .whatsapp-button {
    width: 52px;
    height: 52px;
  }

  .whatsapp-label {
    display: none;
  }
}

.marca-row{
  display:grid;
  grid-template-columns:200px repeat(3,1fr);
  gap:16px;
  margin-bottom:24px;
}

.marca-logo,
.volante-card{
  cursor:pointer;

  border-radius:16px;
  overflow:hidden;

  background:rgba(15,23,42,.7);

  border:1px solid rgba(56,189,248,.2);

  transition:.3s;
}

.marca-logo:hover,
.volante-card:hover{
  transform:translateY(-6px);
  box-shadow:0 12px 30px rgba(0,0,0,.4);
}

.marca-logo img,
.volante-card img{
  width:100%;
  height:180px;
  object-fit:contain;
}

.modal-galeria {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,.94);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 99999;
}

.modal-imagem {
  max-width: 85%;
  max-height: 80vh;
  object-fit: contain;

  animation: fadeModal .25s ease;
}

.modal-fechar {
  position: absolute;
  top: 20px;
  right: 30px;

  background: none;
  border: none;

  color: white;
  font-size: 40px;

  cursor: pointer;
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 60px;
  height: 60px;

  border: none;
  border-radius: 50%;

  background: rgba(255,255,255,.08);
  color: white;

  font-size: 32px;
  cursor: pointer;

  transition: .2s;
}

.modal-nav:hover {
  background: rgba(255,255,255,.18);
}

.modal-prev {
  left: 40px;
}

.modal-next {
  right: 40px;
}

.modal-indicador {
  position: absolute;
  bottom: 25px;

  color: white;

  font-size: 14px;
  background: rgba(255,255,255,.08);

  padding: 8px 16px;
  border-radius: 999px;
}

@keyframes fadeModal {
  from {
    opacity: 0;
    transform: scale(.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>