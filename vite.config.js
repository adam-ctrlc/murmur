import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from 'flowbite-react/plugin/vite';
import { terser } from 'rollup-plugin-terser';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  build: {
    minify: 'esbuild', // Ensure minification using esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Removes console.* statements
      },
    },
    rollupOptions: {
      plugins: [
        terser(), // Apply terser plugin for minification and drop console statements
      ],
    },
  },
});
