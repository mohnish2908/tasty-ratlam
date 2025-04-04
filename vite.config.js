import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../',         // ⬅️ Output the build files to root directory
    emptyOutDir: false     // ⬅️ Don't delete the server folder during build
  }
})
