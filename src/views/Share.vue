<script setup>
/**
 * 分享链接接收页：从 hash ?share=<id> 读出 localStorage 里的查询状态，
 * 跳转到 /manage 并复现搜索。
 *
 * 注：GitHub Pages 静态部署下，分享链接是 localStorage only —— 接收方必须
 * 在同一个浏览器（或同一台电脑）才能读到。当前浏览器不同 tab 之间共享 localStorage。
 */
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  // 兼容：/share/:id（旧契约）或 /share?id=<id>（新契约 hash 模式）
  const id = route.query.id || route.params.id
  if (!id) {
    router.replace('/manage')
    return
  }
  try {
    const payload = await api.share.get(id)
    if (!payload) {
      alert('分享链接无效或已过期（仅在同一浏览器内有效）')
      router.replace('/manage')
      return
    }
    const qs = new URLSearchParams()
    if (payload.q) qs.set('q', payload.q)
    if (payload.venue) qs.set('venue', payload.venue)
    if (payload.year) qs.set('year', payload.year)
    router.replace(`/manage?${qs.toString()}`)
  } catch (e) {
    alert('分享链接无效或已过期：' + e.message)
    router.replace('/manage')
  }
})
</script>

<template>
  <section class="glass card" style="margin-top:80px;text-align:center">
    <p class="muted">正在恢复分享状态…</p>
  </section>
</template>