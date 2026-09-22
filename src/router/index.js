/**
 * 路由：5 个核心功能页 + 2 个附加页 + 详情页。
 * 单层扁平结构，便于直接理解信息架构。
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页 · 热门方向总览' }
  },
  {
    path: '/crawl',
    name: 'crawl',
    component: () => import('@/views/Crawl.vue'),
    meta: { title: '论文爬取 / 导入' }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/views/Manage.vue'),
    meta: { title: '论文列表管理' }
  },
  {
    path: '/top10',
    name: 'top10',
    component: () => import('@/views/Top10.vue'),
    meta: { title: 'Top10 热门方向' }
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('@/views/Graph.vue'),
    meta: { title: '关键词图谱' }
  },
  {
    path: '/trend',
    name: 'trend',
    component: () => import('@/views/Trend.vue'),
    meta: { title: '热度走势对比' }
  },
  {
    path: '/paper/:id',
    name: 'paper',
    component: () => import('@/views/PaperDetail.vue'),
    meta: { title: '论文详情' }
  },
  {
    path: '/share/:id',
    name: 'share',
    component: () => import('@/views/Share.vue'),
    meta: { title: '分享链接' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: { title: '了解更多' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} · CV Paper Trend`
  }
})

export default router