import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
    css: {
    devSourcemap: true, // 개발 환경에서 소스맵 활성화
  },
})
