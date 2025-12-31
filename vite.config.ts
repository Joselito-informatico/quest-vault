import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // <--- Importamos path

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Esto le dice a Vite: "Cada vez que veas '@', mira en la carpeta 'src'"
      "@": path.resolve(__dirname, "./src"),
    },
  },
})