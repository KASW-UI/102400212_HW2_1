<script setup>
/**
 * 应用根组件：包裹 NavBar + <router-view/>。
 * 整体配色走深色玻璃拟态，搭配渐变背景。
 */
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="app-shell">
    <div class="bg-aurora" aria-hidden="true"></div>
    <NavBar />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="app-footer">
      <span>© 2026 CV Paper Trend · 与 AI 结对开发 · 数据来源 DBLP / 会议官网</span>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
}
.app-main {
  flex: 1;
  width: min(1280px, 92vw);
  margin: 0 auto;
  padding: 32px 0 80px;
}
.app-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  padding: 16px 0 24px;
}
.bg-aurora {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse at 20% 10%, rgba(91, 141, 239, 0.35), transparent 55%),
    radial-gradient(ellipse at 80% 0%, rgba(124, 58, 237, 0.30), transparent 55%),
    radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.18), transparent 60%),
    linear-gradient(180deg, #0b1020 0%, #0a0f1f 100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>