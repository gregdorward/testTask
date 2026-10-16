import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone web UI — no backend proxy needed; data is served in-browser.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
