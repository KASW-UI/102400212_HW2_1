<script setup>
/**
 * 分享链接接收页：从 /share/:id 读出后端存的查询状态，跳转到 /manage 并复现搜索。
 */
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const payload = await api.share.get(route.params.id)
    // 把查询条件写到 store / session，跳到 manage
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