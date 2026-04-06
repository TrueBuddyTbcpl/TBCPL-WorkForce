import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => ({    // ✅ function form, receives mode
  plugins: [react()],
  define: {
    __DEV_CONFIG__: JSON.stringify({
      mockApi: mode === 'development',           // ✅ use mode, not import.meta.env
      apiDelay: 500,
    }),
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
  },
  optimizeDeps: {
    include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'],
  },
}))                                             // ✅ closing )) not });
