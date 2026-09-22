import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// Vite 配置：构建 CV 论文分析平台 SPA
// 部署到 CodeArts / 云服务器时执行 npm run build，产物在 dist/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 ECharts 单独拆包，便于 CDN 缓存复用
          echarts: ['echarts', 'vue-echarts']
        }
      }
    }
  }
})