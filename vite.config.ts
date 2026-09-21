import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Note: lucide-react is deliberately left out of manual chunks —
        // forcing it into its own chunk defeats per-icon tree-shaking and
        // bundles the entire icon set instead of just the ones used.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
