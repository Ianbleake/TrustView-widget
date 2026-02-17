import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TrustViewWidget',
      fileName: 'widget',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
