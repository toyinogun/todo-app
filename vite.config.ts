import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/todo-app/', // spec 0001: GitHub Pages serves from the repo sub path
  build: {
    rollupOptions: {
      // spec 0004: landing at the root, the list one step in at /app/
      input: { landing: 'index.html', app: 'app/index.html' },
    },
  },
})
