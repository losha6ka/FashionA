import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // важно для корректных относительных путей
  plugins: [react()],
});
