import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: '/toc_public/', // GitHub Pages base path
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
