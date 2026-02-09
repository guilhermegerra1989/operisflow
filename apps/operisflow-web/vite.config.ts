import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',   // permite acesso externo (via Nginx ou Docker)
    port: 5173,        // porta padrão do Vite
    strictPort: true,  // não muda de porta se estiver ocupada
    cors: true         // útil para dev com API externa
  }
})