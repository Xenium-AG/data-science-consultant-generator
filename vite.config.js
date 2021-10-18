import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
const BASE = '/data-science-consultant-generator/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: BASE,
})
