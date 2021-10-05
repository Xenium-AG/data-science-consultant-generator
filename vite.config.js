import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
const BASE = '/app/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: BASE,
})
