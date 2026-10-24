import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [reactRouter()],
    server: {
      port: 5173,
      strictPort: true,
      // Same-origin /api calls in development, forwarded to the ASP.NET Core API.
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'https://localhost:7237',
          changeOrigin: true,
          secure: false, // local dev certificate
        },
      },
    },
  };
});
