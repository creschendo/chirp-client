import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Port 5173 must match CLIENT_ORIGIN in chirp-service's .env, or CORS blocks the requests.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
