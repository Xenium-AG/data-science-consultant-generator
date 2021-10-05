import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import { visualizer } from 'rollup-plugin-visualizer'
const BASE = '/app/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), visualizer()],
  base: BASE,
  build: {
    terserOptions: {
      compress: {
        keep_fargs: false,
        pure_getters: true,
        toplevel: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_undefined: true,
      },
      ecma: 2016,
    },
  },
})
