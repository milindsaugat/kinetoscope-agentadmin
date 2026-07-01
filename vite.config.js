import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5175,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://192.168.1.22:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
