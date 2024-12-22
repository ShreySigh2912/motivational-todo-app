import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/motivational-todo-app/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
  }
})