import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: false,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/*.spec.ts'],
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: [
      {
        find: /\@\//,
        replacement: `${resolve(__dirname, 'src')}/`,
      },
    ],
  },
})
