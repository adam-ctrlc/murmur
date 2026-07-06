import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Emit an extra legacy bundle (transpiled by Babel with core-js polyfills)
    // for browsers that lack native ES module support.
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});
