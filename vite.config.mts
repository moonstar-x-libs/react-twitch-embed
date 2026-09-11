import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

const config: UserConfig = defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named'
      }
    }
  }
});

export default config;
