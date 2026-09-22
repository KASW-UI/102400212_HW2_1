<script setup>
/**
 * 论文详情页：点击标题、图谱下钻均可进入。
 */
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'

const route = useRoute()
const paper = ref(null)
const loading = ref(true)
const error = ref(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    paper.value = await api.papers.get(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.id, load)
</script>

<template>
  <section>
    <router-link to="/manage" class="muted" style="font-size:13px">← 返回列表</router-link>

    <div v-if="loading" class="glass card" style="margin-top:16px">
      <p class="muted">加载中…</p>
    </div>
    <div v-else-if="error" class="glass card" style="margin-top:16px">
      <p style="color:var(--c-danger)">{{ error }}</p>
    </div>
    <article v-else-if="paper" class="glass card" style="margin-top:16px">
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        <span class="tag tag-blue">{{ paper.venue }} {{ paper.year }}</span>
        <span v-for="kw in paper.keywords" :key="kw" class="tag">{{ kw }}</span>
      </div>
      <h1 class="h1" style="margin-top:10px">{{ paper.title }}</h1>
      <p class="muted" style="font-size:14px">
        {{ (paper.authors || []).join(', ') }}
      </p>

      <h3 class="h2" style="margin-top:18px">摘要</h3>
      <p style="line-height:1.7;color:rgba(231,234,243,0.85)">{{ paper.abstract || '（暂无摘要）' }}</p>

      <h3 class="h2" style="margin-top:18px">原文链接</h3>
      <p>
        <a v-if="paper.url" :href="paper.url" target="_blank" rel="noopener">{{ paper.url }}</a>
        <span v-else class="muted">（暂无）</span>
      </p>

      <h3 class="h2" style="margin-top:18px">DOI</h3>
      <p>
        <a
          v-if="paper.doi"
          :href="`https://doi.org/${paper.doi}`"
          target="_blank"
          rel="noopener"
          class="doi-link"
        >{{ paper.doi }} ↗</a>
        <span v-else class="muted">（暂无）</span>
      </p>

      <h3 class="h2" style="margin-top:18px">元数据</h3>
      <table class="table" style="max-width:480px">
        <tbody>
          <tr><td class="muted">DOI</td><td><code>{{ paper.doi || '—' }}</code></td></tr>
          <tr><td class="muted">ID</td><td><code>{{ paper.id }}</code></td></tr>
          <tr><td class="muted">会议</td><td>{{ paper.venue }}</td></tr>
          <tr><td class="muted">年份</td><td>{{ paper.year }}</td></tr>
          <tr><td class="muted">作者数</td><td>{{ (paper.authors || []).length }}</td></tr>
        </tbody>
      </table>
    </article>
  </section>
</template>

<style scoped>
code {
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
}
.doi-link {
  font-family: var(--font-mono);
  font-size: 14px;
  color: #c4b5fd;
}
</style>