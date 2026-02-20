import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(),tailwindcss()],
  define: {
    process: {
      env: {
        NODE_ENV: "production"
      }
    }
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "Trustview",
      fileName: () => "trustview-widget.bundle.js",
      formats: ["iife"]
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});