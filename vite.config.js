import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
    open: true,
    hmr: {
      host: 'localhost',
      port: 5173
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false
  },
  // Serve sections/ as static assets
  publicDir: 'public'
});
