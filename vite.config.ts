import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.', // 输出到根目录
    emptyOutDir: false, // 不要清空根目录
  },
})