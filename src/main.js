/**
 * 应用入口：注册路由、Pinia、全局样式。
 * 由 Vite 加载，是 SPA 的启动点。
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')