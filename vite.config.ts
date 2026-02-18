import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),react()],
  build: {
    lib: {
      entry: 'src/bootstrap/index.ts',
      name: 'TrustviewWidget',
      formats: ['iife'],
      fileName: () => 'widget.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  }
  
})
