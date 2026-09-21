import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Group node_modules by package name to avoid circular chunk issues
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          const afterNodeModules = id.split('node_modules')[1];
          if (!afterNodeModules) return undefined;
          const parts = afterNodeModules.split(/[\\/]/).filter(Boolean);
          let pkg = parts[0];
          if (pkg && pkg.startsWith('@') && parts.length > 1) {
            pkg = `${pkg}/${parts[1]}`;
          }
          // sanitize and prefix to keep chunk names predictable
          return `vendor.${pkg.replace('@', '').replace('/', '_')}`;
        },
      },
    },
    // keep default chunk size warning but fine-tune if needed
    chunkSizeWarningLimit: 700,
  },
})
