import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './CartWidget': './src/components/CartWidget.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5175,
    cors: true,
  },
  preview: {
    port: 5175,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
});
