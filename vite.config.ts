import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' => semua path aset relatif, aman di Vercel maupun di subfolder / file server statis.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
});
