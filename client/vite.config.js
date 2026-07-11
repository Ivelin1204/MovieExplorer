import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/MovieExplorer/' : '/',
  plugins: [react()],
  server: {
    port: 5183,
    strictPort: true,
  },
})
