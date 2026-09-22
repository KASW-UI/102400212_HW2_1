<script setup>
/**
 * 顶部导航。响应式：移动端折叠成汉堡菜单。
 */
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)

const links = [
  { to: '/', label: '首页总览', icon: '⌂' },
  { to: '/crawl', label: '爬取 / 导入', icon: '↧' },
  { to: '/manage', label: '论文管理', icon: '✎' },
  { to: '/top10', label: 'Top10 热门', icon: '★' },
  { to: '/graph', label: '关键词图谱', icon: '◌' },
  { to: '/trend', label: '热度走势', icon: '↗' },
  { to: '/about', label: '了解更多', icon: 'ⓘ' }
]
</script>

<template>
  <header class="nav">
    <div class="nav-inner">
      <RouterLink to="/" class="brand" @click="open = false">
        <span class="brand-logo">CV</span>
        <span class="brand-text">
          <strong>Paper Trend</strong>
          <small>CVPR · ICCV · ECCV</small>
        </span>
      </RouterLink>

      <button class="nav-toggle" @click="open = !open" :aria-expanded="open">
        <span></span><span></span><span></span>
      </button>

      <nav :class="['nav-links', { open }]" @click="open = false">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="nav-link"
          :class="{ active: route.path === l.to }"
        >
          <span class="icon">{{ l.icon }}</span>
          {{ l.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 15, 31, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.nav-inner {
  width: min(1280px, 92vw);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  gap: 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--c-text);
}
.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.5px;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.brand-text strong {
  font-size: 15px;
}
.brand-text small {
  font-size: 11px;
  color: var(--c-text-mute);
  letter-spacing: 1px;
}
.nav-toggle {
  display: none;
  background: transparent;
  border: none;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
}
.nav-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--c-text);
  border-radius: 1px;
}
.nav-links {
  display: flex;
  gap: 4px;
  align-items: center;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  color: var(--c-text-dim);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.18s ease, color 0.18s ease;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--c-text);
}
.nav-link.active {
  background: linear-gradient(135deg, rgba(91, 141, 239, 0.2), rgba(124, 58, 237, 0.2));
  color: #fff;
  border: 1px solid rgba(124, 58, 237, 0.35);
}
.icon {
  font-size: 14px;
  opacity: 0.8;
}

@media (max-width: 880px) {
  .nav-toggle {
    display: flex;
  }
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(10, 15, 31, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-direction: column;
    padding: 14px 4vw 22px;
    align-items: stretch;
    display: none;
  }
  .nav-links.open {
    display: flex;
  }
  .nav-link {
    padding: 12px 16px;
  }
}
</style>