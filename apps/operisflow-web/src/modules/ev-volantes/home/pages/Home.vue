<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue'
import { computed } from 'vue'

const imagemAtual = computed(() => {
  return imagens.value[indiceAtual.value] || null
})

const modalAberto = ref(false)
const indiceAtual = ref(0)
const imagens = ref<{ src: string; nome: string }[]>([])

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


let intervalId: number

onMounted(() => {
  intervalId = window.setInterval(() => {
    indiceProduto.value =
      (indiceProduto.value + 1) %
      produtosDestaque.length
  }, 3500)

  window.addEventListener('keydown', handleKey)
  window.addEventListener('scroll', verificarScroll)

})

onUnmounted(() => {
  clearInterval(intervalId)
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('scroll', verificarScroll)

})


const mostrarVoltarTopo = ref(false)

function verificarScroll() {
  mostrarVoltarTopo.value = window.scrollY > 600
}

function voltarAoTopo() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}



const galerias = {
  CHEVROLET: [
    { src: '/volantes_esportivos/CHEVROLET/cruze_universal_azul.png', nome: 'Cruze universal azul' },
    { src: '/volantes_esportivos/CHEVROLET/tracker_controle_universal.png', nome: 'Tracker controle universal' },
    { src: '/volantes_esportivos/CHEVROLET/volante_gti_vision.png', nome: 'GTI Vision' },
    { src: '/volantes_esportivos/CHEVROLET/cruze_universal_branco.png', nome: 'Cruze universal branco' },
    { src: '/volantes_esportivos/CHEVROLET/cruze_universal_vermelho.png', nome: 'Cruze universal vermelho' },
    { src: '/volantes_esportivos/CHEVROLET/tracker_aplique_universal.png', nome: 'Tracker aplique universal' },
    { src: '/volantes_esportivos/CHEVROLET/tracker_controle_led_alma_corsa_celta.png', nome: 'Tracker controle LED' },
    { src: '/volantes_esportivos/CHEVROLET/volante_black.png', nome: 'Volante Black' }
  ],

  VOLKSWAGEN: [
    { src: '/volantes_esportivos/VOLKSWAGEN/nivus_controle_universal.png', nome: 'Nivus controle universal' },
    { src: '/volantes_esportivos/VOLKSWAGEN/novo_golf.png', nome: 'Novo Golf' },
    { src: '/volantes_esportivos/VOLKSWAGEN/volante_gti_vision.png', nome: 'GTI Vision' },
    { src: '/volantes_esportivos/VOLKSWAGEN/gol_g5_original.png', nome: 'Gol G5 Original' },
    { src: '/volantes_esportivos/VOLKSWAGEN/nivus_universal.png', nome: 'Nivus universal' },
    { src: '/volantes_esportivos/VOLKSWAGEN/volante_esportivo_rallye.png', nome: 'Rallye Esportivo' }
  ],

  FIAT: [
    { src: '/volantes_esportivos/FIAT/volante_fire_original.png', nome: 'Fire original' },
    { src: '/volantes_esportivos/FIAT/toro_black_alma_original.png', nome: 'Toro black alma original' },
    { src: '/volantes_esportivos/FIAT/volante_gti_vision.png', nome: 'GTI Vision' },
    { src: '/volantes_esportivos/FIAT/volante_palio_novo.png', nome: 'Palio novo' },
    { src: '/volantes_esportivos/FIAT/volante_rallye.png', nome: 'Rallye' },
    { src: '/volantes_esportivos/FIAT/pulse_black_alma_original.png', nome: 'Pulse black alma original' },
    { src: '/volantes_esportivos/FIAT/palio_novo_azul.png', nome: 'Palio azul' },
    { src: '/volantes_esportivos/FIAT/nivus_aplique_universal.png', nome: 'Nivus aplique universal' }
  ],

  FORD: [
    { src: '/volantes_esportivos/FORD/volante_ford.png', nome: 'Volante Ford' },
    { src: '/volantes_esportivos/FORD/volante_gti_vision_ford_ka.png', nome: 'GTI Vision Ford Ka' },
    { src: '/volantes_esportivos/FORD/volante_rallye_ford.png', nome: 'Rallye Ford' }
  ]
} as const


type Marca = keyof typeof galerias

function abrirGaleria(marca: Marca) {
  imagens.value = [...galerias[marca]]
  indiceAtual.value = 0

  if (imagens.value.length > 0) {
    modalAberto.value = true
  }
}


const produtosDestaque = [

  // CHEVROLET
  {
    src: '/volantes_esportivos/CHEVROLET/cruze_universal_azul.png',
    nome: 'Cruze Universal Azul'
  },
  {
    src: '/volantes_esportivos/CHEVROLET/tracker_controle_universal.png',
    nome: 'Tracker Controle Universal'
  },
  {
    src: '/volantes_esportivos/CHEVROLET/cruze_universal_branco.png',
    nome: 'Cruze Universal Branco'
  },
  {
    src: '/volantes_esportivos/CHEVROLET/cruze_universal_vermelho.png',
    nome: 'Cruze Universal Vermelho'
  },
  {
    src: '/volantes_esportivos/CHEVROLET/tracker_aplique_universal.png',
    nome: 'Tracker Aplique Universal'
  },
  {
    src: '/volantes_esportivos/CHEVROLET/tracker_controle_led_alma_corsa_celta.png',
    nome: 'Tracker Controle LED'
  },
  {
    src: '/volantes_esportivos/CHEVROLET/volante_black.png',
    nome: 'Volante Black'
  },

  // VOLKSWAGEN
  {
    src: '/volantes_esportivos/VOLKSWAGEN/nivus_controle_universal.png',
    nome: 'Nivus Controle Universal'
  },
  {
    src: '/volantes_esportivos/VOLKSWAGEN/novo_golf.png',
    nome: 'Novo Golf'
  },
  {
    src: '/volantes_esportivos/VOLKSWAGEN/volante_gti_vision.png',
    nome: 'GTI Vision'
  },
  {
    src: '/volantes_esportivos/VOLKSWAGEN/gol_g5_original.png',
    nome: 'Gol G5 Original'
  },
  {
    src: '/volantes_esportivos/VOLKSWAGEN/nivus_universal.png',
    nome: 'Nivus Universal'
  },
  {
    src: '/volantes_esportivos/VOLKSWAGEN/volante_esportivo_rallye.png',
    nome: 'Rallye Esportivo'
  },

  // FIAT
  {
    src: '/volantes_esportivos/FIAT/volante_fire_original.png',
    nome: 'Fire Original'
  },
  {
    src: '/volantes_esportivos/FIAT/toro_black_alma_original.png',
    nome: 'Toro Black'
  },
  {
    src: '/volantes_esportivos/FIAT/volante_palio_novo.png',
    nome: 'Palio Novo'
  },
  {
    src: '/volantes_esportivos/FIAT/volante_rallye.png',
    nome: 'Rallye'
  },
  {
    src: '/volantes_esportivos/FIAT/pulse_black_alma_original.png',
    nome: 'Pulse Black'
  },
  {
    src: '/volantes_esportivos/FIAT/palio_novo_azul.png',
    nome: 'Palio Azul'
  },
  {
    src: '/volantes_esportivos/FIAT/nivus_aplique_universal.png',
    nome: 'Nivus Aplique Universal'
  },

  // FORD
  {
    src: '/volantes_esportivos/FORD/volante_ford.png',
    nome: 'Volante Ford'
  },
  {
    src: '/volantes_esportivos/FORD/volante_gti_vision_ford_ka.png',
    nome: 'GTI Vision Ford Ka'
  },
  {
    src: '/volantes_esportivos/FORD/volante_rallye_ford.png',
    nome: 'Rallye Ford'
  }

]

const indiceProduto = ref(0)

const produtoAtual = computed(() => {
  return produtosDestaque[indiceProduto.value]!
})


</script>

<template>
  <div class="page">

    <!-- Header -->
    <header class="header">
      <div class="header-content">

        <div class="logo-area">
          <img
            src="/ev_volantes_image.png"
            alt="EV Volantes"
            class="logo"
          />
          <span class="brand-name">EV Volantes</span>
        </div>

        <nav class="nav">
          <a href="#sobre" class="nav-link">Sobre</a>
          <a href="#fotos" class="nav-link">Produtos</a>
          <a href="#contact" class="nav-link">Contato</a>

          <a  href="https://wa.me/5512982669702?text=Olá! Vim pelo site e gostaria de mais informações."
            target="_blank" rel="noopener noreferrer" class="btn-whatsapp-header">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.87 11.87 0 0012.06 0C5.6 0 .34 5.28.34 11.8c0 2.08.54 4.1 1.56 5.88L0 24l6.52-1.7a11.74 11.74 0 005.54 1.4h.01c6.46 0 11.72-5.28 11.72-11.8 0-3.15-1.22-6.1-3.27-8.42zm-8.46 18.1h-.01a9.8 9.8 0 01-5-1.36l-.36-.21-3.87 1.01 1.03-3.77-.24-.39a9.77 9.77 0 01-1.5-5.26c0-5.41 4.38-9.8 9.77-9.8 2.61 0 5.07 1.02 6.92 2.88a9.73 9.73 0 012.87 6.93c0 5.4-4.38 9.79-9.76 9.79zm5.45-7.32c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.52.08-.8.38-.28.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.1 4.48.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.13-.27-.2-.57-.35z"
              />
            </svg>

            <span class="btn-whatsapp-text">
              Peça seu orçamento
            </span>
          </a>

          <RouterLink
            to="/ev-volantes/login"
            class="btn-outline"
          >
            Entrar / Cadastrar
          </RouterLink>


        </nav>
      </div>
    </header>

    <main class="main">
      <!-- HERO -->
      <section class="hero hero-refinado">

        <div class="hero-text">
          <h1 class="hero-titulo"> <span class="hero-destaque">EV Volantes | Alta Performance e Estética Automotiva </span></h1>      

           <div class="hero-imagem">
            <img src="/ev_volantes.jpeg" alt="EV Volantes" class="hero-banner" />
            <span>
              <p class="hero-subtitulo">
                Atuamos fornecendo volantes completos e revisados com alto padrão
                de qualidade. Atendemos oficinas, lojistas, mecânicas e clientes
                finais que buscam segurança e acabamento impecável.
              </p>
            </span>
          </div>

          <div class="hero-botoes">
            <a href="#fotos" class="btn-hero-primary">Conheça nossos produtos</a>
            <a href="#sobre" class="btn-hero-secondary">Quem somos</a>
            <a href="#fazemos" class="btn-hero-secondary">O que fazemos</a>
          </div>
        </div>

       <div class="hero-imagem">
                <div class="produto-slider">

                  <div class="produto-frame">
                    <img
                        v-if="produtoAtual"
                        :src="produtoAtual.src"
                        :alt="produtoAtual.nome"
                      >
                  </div>

                  <span class="produto-label">
                    {{ produtoAtual.nome }}
                  </span>

                </div>
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
            <!-- MISSÃO -->
            <div class="card-pilar">

              <div class="card-topo">
                <div class="card-icon">
                  <img src="/icons/missao.svg" alt="Missao" />
                </div>

                <div>
                  <span class="card-subtitulo">
                    O QUE NOS MOVE
                  </span>

                  <h3>MISSÃO</h3>
                </div>
              </div>

              <div class="card-conteudo">
                Fabricar e entregar volantes de alta performance que
                elevam a segurança e o prazer de dirigir.

                <br><br>

                Injetamos no mercado automotivo um padrão de qualidade raro,
                superando as expectativas de motoristas e lojistas.
              </div>

            </div>


            <!-- VISÃO -->
            <div class="card-pilar">

              <div class="card-topo">
                <div class="card-icon">
                  <img src="/icons/visao.svg" alt="Visao" />
                </div>

                <div>
                  <span class="card-subtitulo">
                    ROTA PARA O FUTURO
                  </span>

                  <h3>VISÃO</h3>
                </div>
              </div>

              <div class="card-conteudo">
                Ser a marca líder e a principal referência nacional
                em soluções de direção.

                <br><br>

                Buscamos a evolução contínua dos nossos processos para
                ditar as tendências de durabilidade, design e inovação
                do setor.
              </div>

            </div>


            <!-- VALORES -->
            <div class="card-pilar">

              <div class="card-topo">
                <div class="card-icon">
                  <img src="/icons/valores.svg" alt="Valores" />
                </div>

                <div>
                  <span class="card-subtitulo">
                    NOSSO DNA MECÂNICO
                  </span>

                  <h3>VALORES</h3>
                </div>
              </div>

              <div class="card-conteudo">

                <div class="valor-item">
                  Segurança em Primeiro Lugar
                  <small style="margin-left:5px;color: darkgrey;">Cada volante passa por testes ultra responsivos de estrutura e acabamento.</small>
                </div>

                <div class="valor-item">
                  Transparência Total
                  <small style="margin-left:5px;color: darkgrey;">Relações claras, éticas e diretas com os clientes, colaboradores e parceiros.</small>
                </div>

                <div class="valor-item">
                  Credibilidade e Confiança
                  <small style="margin-left:5px;color: darkgrey;">Entregar exatamente o que prometemos: produtos robustos e prontos para a rodagem.</small>
                </div>

                <div class="valor-item">
                  Alta Performance
                  <small style="margin-left:5px;color: darkgrey;">Inconformismo com o comum; nossa busca pela perfeição é constante e incansável.</small>
                </div>

              </div>

            </div>
        </div>
      </section>

       <!-- FAZEMOS NA EMPRESA -->
      <section id="fazemos" class="section sobre-elegante">


      <!-- O QUE FAZEMOS -->
      <div class="card-servico">

        <div class="servico-topo">
          <div class="servico-icon">
              <img src="/icons/ferramentas.svg" >
          </div>

          <div>
            <span class="servico-subtitulo">
              SOLUÇÕES EV VOLANTES
            </span>

            <h3 class="servico-titulo">
              O QUE FAZEMOS
            </h3>
          </div>
        </div>

        <div class="servico-item">
          <strong>ATACADO</strong>
          <p> Distribuição robusta com condições competitivas para lojistas e autopeças. </p>
        </div>

        <div class="servico-item">
          <strong>BASE DE TROCA</strong>
          <p> Solução sustentável e rápida, minimizando o tempo do veículo parado. </p>
        </div>


        <!-- PREMIUM -->
        <div class="card-servico destaque-premium">
          <div class="servico-topo">
            <div class="servico-icon">
              <img src="/icons/premium.svg" >
            </div>

            <div>
              <span class="servico-subtitulo">
                PERFORMANCE E ACABAMENTO
              </span>

              <h3>LINHA PREMIUM</h3>
            </div>
          
          </div>

          <div style="display: flex; justify-content: flex-end;padding-bottom: 10px;">
              <a href="/pdf/catalogo_premium.pdf"  download  class="btn-catalogo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5z"/>
                </svg>
                <span> Download do Catálogo</span>
              </a>
          </div>

          <div class="premium-lista">

            <div class="premium-item">
              <b style="color: darkgrey;">Inspeção de Alta Precisão</b>: <small style="margin-left:5px;">Cada volante passa por testes ultra responsivos de estrutura e acabamento.</small>
            </div>

            <div class="premium-item">
              <b  style="color: darkgrey;">Pronto para Instalação</b>: <small style="margin-left:5px;">Peças rigorosamente limpas, revisadas e preparadas para entrega imediata.</small>
            </div>

            <div class="premium-item">
              <b  style="color: darkgrey;">Materiais</b>: <small style="margin-left:5px;">Matéria-prima selecionada e de alta qualidade.</small>
          </div>

            <div class="premium-item">
              <b  style="color: darkgrey;">Mão de Obra Especializada</b>: <small style="margin-left:5px;">Equipe altamente treinada e capacitação continuada.</small>
            </div>

              
          </div>
        </div>

      </div>


      <div class="banner-diferencial">
        <div class="banner-icon">
          ✓
        </div>

        <div class="banner-texto">
          <span class="banner-tag">
            DIFERENCIAL DE FÁBRICA
          </span>

          <h3>
            Todos os modelos acompanham Cubo de Adaptação em Alumínio
          </h3>

          <p>
            Compatibilidade Plug-and-Play para diversas montadoras.
            Instalação rápida, segura e com acabamento profissional.
          </p>
        </div>
      </div>

      </section>

      <!-- GALERIA DE FOTOS -->
      <section id="fotos" class="section section-alt">
        <div class="section-header">
          <h2 class="title-gradient">Volantes Esportivos</h2>
          <p></p>
        </div>

        <div class="galeria-grid">
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> 
            <img src="/marcas/chevrolet.png" alt="Chevrolet" />
              <div class="foto-legenda">
                Chevrolet
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> 
            <img src="/volantes_esportivos/CHEVROLET/cruze_universal_azul.png" alt="Cruze" />
            <div class="foto-legenda">
                Cruze universal azul
            </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> 
            <img src="/volantes_esportivos/CHEVROLET/tracker_controle_universal.png" alt="Tracker" />
              <div class="foto-legenda">
                Tracker controle universal
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('CHEVROLET')"> 
            <img src="/volantes_esportivos/CHEVROLET/volante_gti_vision.png" alt="Gti" />
              <div class="foto-legenda">
                Gti vision
              </div>
          </div>

          
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> 
            <img src="/marcas/volkswagen.png" alt="Volkswagen" />
              <div class="foto-legenda">
                Volkswagen
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> 
            <img src="/volantes_esportivos/VOLKSWAGEN/nivus_controle_universal.png" alt="Nivus" />
              <div class="foto-legenda">
                Nivus controle universal
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')">
            <img src="/volantes_esportivos/VOLKSWAGEN/novo_golf.png">
              <div class="foto-legenda">
                Novo Golf
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('VOLKSWAGEN')"> 
            <img src="/volantes_esportivos/VOLKSWAGEN/volante_gti_vision.png" alt="Gti" />
              <div class="foto-legenda">
                Gti vision
              </div>
          </div>


          <div class="foto-card" @click="abrirGaleria('FIAT')"> 
            <img src="/marcas/fiat.png" alt="Fiat" />
              <div class="foto-legenda">
                Fiat
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('FIAT')"> 
            <img src="/volantes_esportivos/FIAT/volante_fire_original.png" alt="Fire" />
              <div class="foto-legenda">
                Fire original
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('FIAT')"> 
            <img src="/volantes_esportivos/FIAT/toro_black_alma_original.png" alt="Toro" />
              <div class="foto-legenda">
                Toro black alma original
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('FIAT')"> 
            <img src="/volantes_esportivos/FIAT/volante_gti_vision.png" alt="Gti" />
              <div class="foto-legenda">
                Gti vision
              </div>
          </div>


          <div class="foto-card" @click="abrirGaleria('FORD')"> 
            <img src="/marcas/ford.png" alt="Ford" />
              <div class="foto-legenda">
                Ford
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('FORD')"> 
            <img src="/volantes_esportivos/FORD/volante_ford.png" alt="Ford" />
              <div class="foto-legenda">
                Ford
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('FORD')"> 
            <img src="/volantes_esportivos/FORD/volante_rallye_ford.png" alt="Ford Rallye" />
            <div class="foto-legenda">
                Ford rallye
              </div>
          </div>
          <div class="foto-card" @click="abrirGaleria('FORD')"> 
            <img src="/volantes_esportivos/FORD/volante_gti_vision_ford_ka.png" alt="Ford Ka" />
              <div class="foto-legenda">
                Gti vision ford Ka
              </div>
          </div>

        </div>
      </section>

      <!-- CONTATO -->
      <section id="contact" class="section section-alt">
        
        <div class="contact-destaque">
          Solicite um orçamento ou fale diretamente com nossa equipe.
        </div>

        <div class="contact-item">
          <strong>E-mail</strong>
          <span>administracao@evvolantes.com.br</span>
        </div>

        <div class="contact-item">
          <strong>WhatsApp</strong>

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
        </div>

        <div class="contact-item">
          <strong>Instagram</strong>

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
        </div>

      </section>
    </main>

    <button  v-if="mostrarVoltarTopo" @click="voltarAoTopo" class="btn-topo">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 4l-8 8h5v8h6v-8h5z"
          />
        </svg>
    </button>

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

        <div class="modal-content" v-if="imagemAtual">
          <img :src="imagemAtual.src" class="modal">

          <div class="modal-nome">
            {{ imagemAtual.nome }}
          </div>
        </div>

        <button class="modal-nav modal-next" @click="proxima">   ❯  </button>
        <div class="modal-indicador"> {{ indiceAtual + 1 }} / {{ imagens.length }} </div>
    </div>


  </div>

</template>

<style scoped>
:root {
  --ev-blue: #004BFF;
  --ev-blue-hover: #0038c7;
  --ev-black: #111111;
  --ev-carbon: #1a1a1a;
  --ev-gray: #f5f5f5;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  background:
    linear-gradient(
      135deg,
      #111111,
      #171717,
      #0d0d0d
    );

  color: #e5e7eb;
  font-family: system-ui, sans-serif;
  overflow-x: hidden;

  position: relative;       
  isolation: isolate;      
}

.page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;

  background-image:
    linear-gradient(
      135deg,
      rgba(0,75,255,.08) 25%,
      transparent 25%
    ),
    url('/back-volantes-esportivos.jpg');

  background-size:
    40px 40px,
    cover;

  opacity: .18;
}

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
  background: #004BFF;
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

/* SECTIONS */
.section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.section-alt {
  background: transparent; 
}

.section-header {
  margin-bottom: 1.5rem;
  align-items: center;
}

#fotos .section-header {
  color: rgba(0,75,255,.75);
  text-align: center;
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
  border-radius: 14px;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.30),
      rgba(10,10,10,.35)
    );

  border: 1px solid rgba(0,75,255,.15);

  display: flex;
  flex-direction: column;

  cursor: pointer;
}

.foto-legenda {
  padding: 10px;

  text-align: center;

  font-size: .85rem;
  font-weight: 700;

  color: white;

  background: rgba(0,75,255,.75);

  backdrop-filter: blur(4px);
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
  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.62),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 22px;

  padding: 2rem;

  backdrop-filter: blur(8px);
}

.contact-item {
  display: flex;
  flex-direction: column;

  gap: 6px;

  padding: 18px;

  margin-bottom: 14px;

  border-radius: 14px;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.05);
}

#contact .section-header {
  text-align: center;
}

#contact h2 {
  color: #004BFF;

  font-size: 2rem;

  margin-bottom: 10px;
}

.contact-destaque {
  margin-bottom: 20px;

  padding: 16px;

  border-left: 4px solid #004BFF;

  background: rgba(187, 198, 223, 0.18);

  color: #dbeafe;

  border-radius: 10px;
}

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
  color: #004BFF;
  text-decoration: none;
  font-weight: 500;
}

.insta-link:hover {
  color: #004BFF;
}

.insta-icon {
  color: #004BFF;
  transition: 0.2s;
}

.insta-link:hover .insta-icon {
  color: #004BFF;
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
  background: linear-gradient(to right, #004BFF, #004BFF);
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
  color: #004BFF;
  font-weight: 800;
  font-size: 1.9rem;
  margin-top: 6px;
}

.hero-subtitulo {
  margin-top: 1rem;
  margin-left: 2rem;
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
  background: #004BFF;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(14,165,233,0.35);
}

.btn-hero-primary:hover {
  background: #004BFF;
  color: #becff5;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(14,165,233,0.45);
}

.btn-hero-secondary {
  border: 2px solid #004BFF;
  color: #004BFF;
  background: transparent;
}

.btn-hero-secondary:hover {
  background: rgba(56, 189, 248, 0.12);
  color: #becff5;
  transform: translateY(-2px);
}

/* Imagem */
.hero-imagem {
  display: flex;
  justify-content: center;
}

.hero-banner {
  width: 160px;
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
  animation: shakeWhatsapp 6s infinite;
  position: fixed;
  bottom: 24px;
  right: 24px;

  display: flex;
  align-items: center;
  gap: 10px;

  text-decoration: none;
  z-index: 999;
}

@keyframes shakeWhatsapp {

  0%,
  90%,
  100% {
    transform: rotate(0);
  }

  91% {
    transform: rotate(-8deg);
  }

  92% {
    transform: rotate(8deg);
  }

  93% {
    transform: rotate(-8deg);
  }

  94% {
    transform: rotate(8deg);
  }

  95% {
    transform: rotate(0);
  }
}

.whatsapp-button {
  width: 60px;
  height: 60px;

  border-radius: 50%;

  background: #25d366;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: pulseWhatsapp 2s infinite;
}

@keyframes pulseWhatsapp {

  0% {
    box-shadow:
      0 0 0 0 rgba(37,211,102,.6);
  }

  70% {
    box-shadow:
      0 0 0 18px rgba(37,211,102,0);
  }

  100% {
    box-shadow:
      0 0 0 0 rgba(37,211,102,0);
  }

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

.modal {
  max-width: 85%;
  max-height: 80vh;
  object-fit: contain;

  animation: fadeModal .25s ease;
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

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 3rem;
}

.card-pilar {
  position: relative;

  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.25);

  border-radius: 22px;

  padding: 28px;

  overflow: hidden;

  transition: .35s ease;

  box-shadow:
    0 10px 30px rgba(0,0,0,.35);
}

.card-pilar::before {
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

.card-pilar:hover {
  transform: translateY(-8px);

  border-color: #004BFF;

  box-shadow:
    0 18px 45px rgba(0,75,255,.22);
}

.card-topo {
  display: flex;
  align-items: center;
  gap: 16px;

  margin-bottom: 22px;
}

.card-icon {
  width: 70px;
  height: 70px;

  border-radius: 18px;

  background:
    rgba(0,75,255,.12);

  border:
    1px solid rgba(0,75,255,.25);

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
}

.card-icon img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.card-subtitulo {
  display: block;

  color: #004BFF;

  font-size: .75rem;

  letter-spacing: 2px;

  font-weight: 700;
}

.card-pilar h3 {
  margin-top: 4px;

  font-size: 1.6rem;

  color: white;

  font-weight: 800;

  letter-spacing: 1px;
}

.card-conteudo {
  color: #d6d6d6;

  line-height: 1.8;
}

.valor-item {
  position: relative;

  margin-bottom: 12px;

  padding-left: 18px;

  color: #e8e8e8;
}

.valor-item::before {
  content: "";

  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #004BFF;

  position: absolute;

  left: 0;
  top: 10px;
}

@media (max-width: 900px) {

  .cards-container {
    grid-template-columns: 1fr;
  }

}

.card-servico {
  background:
    linear-gradient(
      145deg,
      rgba(20,20,20,.65),
      rgba(10,10,10,.68)
    );

  border: 1px solid rgba(0,75,255,.2);
  
  border-radius: 22px;

  padding: 30px;

  transition: .3s;
}

.card-servico:hover {
  transform: translateY(-6px);

  border-color: #004BFF;
}

.servico-topo {
  display: flex;
  align-items: center;
  gap: 16px;

  margin-bottom: 30px;
}

.servico-icon {
  width: 70px;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 18px;

  background: rgba(0,75,255,.12);

  border: 1px solid rgba(0,75,255,.25);
}

.servico-icon img {
  width: 40px;
}

.servico-subtitulo {
  display: block;

  color: #004BFF;

  font-size: .75rem;

  font-weight: 700;

  letter-spacing: 2px;
}


.card-servico h3 {
  margin-top: 4px;

  color: white;

  font-size: 1.7rem;
}

.servico-item {
  padding: 18px;

  margin-bottom: 14px;

  border-radius: 14px;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.04);
}

.servico-item strong {
  color: #004BFF;

  display: block;

  margin-bottom: 6px;
}

.servico-item p {
  color: #d3d3d3;
}

/* .servico-item p {
  color: #475569;
} */

.premium-item {
  padding: 16px 18px;

  margin-bottom: 12px;

  border-left: 4px solid #004BFF;

  background: rgba(255,255,255,.03);

  color: #f1f5f9;

  font-weight: 500;
}

.servico-titulo {
  position: relative;

  margin-top: 4px;
  padding-bottom: 12px;

  color: white;

  font-size: 1.6rem;
  font-weight: 800;
  text-transform: uppercase;
}

.servico-titulo::after {
  content: "";

  position: absolute;
  left: 0;
  bottom: 0;

  width: 50px;
  height: 3px;

  background: #004BFF;

  border-radius: 999px;
}

.btn-catalogo {
  display: inline-flex;
  align-items: center;
  justify-content: center;


  margin-top: 5px;
  margin-bottom: 10px;

  padding: 14px 20px;

  border-radius: 14px;

  background: #004BFF;

  color: white;

  text-decoration: none;

  font-weight: 700;

  transition: .3s;

  box-shadow:
    0 8px 20px rgba(0,75,255,.25);
}

.btn-catalogo:hover {
  background: #0038c7;

  transform: translateY(-2px);

  box-shadow:
    0 12px 28px rgba(0,75,255,.35);
}

.banner-diferencial {
  margin-top: 40px;

  display: flex;
  align-items: center;
  gap: 24px;

  padding: 28px;

  border-radius: 24px;

  background:
    linear-gradient(
      135deg,
      #004BFF,
      #0038c7
    );

  box-shadow:
    0 20px 40px rgba(0,75,255,.35);

  position: relative;

  overflow: hidden;
}

.banner-diferencial::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,.1),
      transparent 40%
    );

  pointer-events: none;
}

.banner-icon {
  width: 80px;
  height: 80px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;

  background: rgba(255,255,255,.15);

  font-size: 2rem;
  font-weight: 800;

  color: white;
}

.banner-tag {
  display: inline-block;

  margin-bottom: 8px;

  font-size: .8rem;
  font-weight: 700;

  letter-spacing: 2px;

  color: rgba(255,255,255,.85);
}

.banner-texto h3 {
  margin: 0;

  font-size: 1.5rem;

  color: white;

  font-weight: 800;
}

.banner-texto p {
  margin-top: 8px;

  color: rgba(255,255,255,.9);

  font-size: 1rem;
}

@media (max-width: 768px) {

  .banner-diferencial {
    flex-direction: column;
    text-align: center;
  }

}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-nome {
  margin-top: 12px;
  padding: 8px 14px;

  font-size: 14px;
  font-weight: 600;
  color: white;

  background: rgba(255,255,255,.08);
  border-radius: 999px;

  backdrop-filter: blur(6px);
}

.produto-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.produto-info {
  margin-top: 12px;

  color: white;

  font-size: 1rem;
  font-weight: 600;
}

.produto-thumbs {
  display: flex;
  gap: 10px;

  margin-top: 20px;
}

.thumb {
  width: 65px;
  height: 65px;

  border-radius: 12px;
  overflow: hidden;

  border: 2px solid transparent;

  background: rgba(255,255,255,.05);

  cursor: pointer;

  transition: .25s;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumb:hover {
  transform: translateY(-3px);
}

.thumb.ativo {
  border-color: #004BFF;

  box-shadow:
    0 0 20px rgba(0,75,255,.4);
}

.produto-frame {
  width: 420px;
  height: 320px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.produto-principal {
  max-width: 100%;
  max-height: 100%;

  object-fit: contain;

  transition:
    opacity .4s ease,
    transform .4s ease;

  filter:
    drop-shadow(
      0 15px 35px rgba(0,0,0,.45)
    );
}

.produto-label {
  margin-top: 10px;

  color: white;

  font-size: 1.1rem;
  font-weight: 700;
}

.produto-principal {
  animation: trocaProduto .5s ease;
}

@keyframes trocaProduto {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-whatsapp-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 16px;

  border-radius: 999px;

  background: #25d366;
  color: white;

  text-decoration: none;
  font-weight: 700;
  font-size: .9rem;

  transition: .25s ease;

  box-shadow:
    0 4px 12px rgba(37,211,102,.3);
}

.btn-whatsapp-header:hover {
  background: #1ebe5d;
  transform: translateY(-2px);
}

.btn-whatsapp-header svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {

  .btn-whatsapp-header {
    padding: 8px 10px;
  }

  .btn-whatsapp-text {
    display: none;
  }

}

@media (max-width: 768px) {

  .btn-outline {
    padding: 8px 12px;
    font-size: .8rem;
  }

}

.btn-topo {
  position: fixed;

  right: 28px;
  bottom: 100px;

  width: 50px;
  height: 50px;

  border: none;
  border-radius: 50%;

  background: rgba(15, 23, 42, 0.95);

  color: white;

  font-size: 22px;
  font-weight: bold;

  cursor: pointer;

  z-index: 998;

  box-shadow:
    0 10px 25px rgba(0,0,0,.35);

  transition: all .25s ease;
}

.btn-topo:hover {
  background: #004BFF;

  transform: translateY(-3px);
}

@media (max-width: 768px) {

  .btn-topo {
    width: 42px;
    height: 42px;

    right: 18px;
    bottom: 84px;

    font-size: 18px;
  }

}

</style>