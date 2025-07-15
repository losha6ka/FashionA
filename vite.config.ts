import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Заменить на свой GitHub repo
const repo = 'https://github.com/losha6ka/FashionArena.git'

export default defineConfig({
  base: `/${repo}/`,  // 👈 важно для GitHub Pages
  plugins: [react()],
})