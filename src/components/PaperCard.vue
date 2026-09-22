<script setup>
/**
 * 论文卡片：在列表 / 搜索结果 / 图谱下钻面板里共用。
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  paper: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})

defineEmits(['edit', 'delete', 'crawl'])

const venueColor = computed(() => {
  const v = props.paper.venue
  if (v === 'CVPR') return 'tag-blue'
  if (v === 'ICCV') return 'tag-orange'
  return 'tag-green'
})
</script>

<template>
  <article class="paper-card" :class="{ compact }">
    <header class="paper-head">
      <div class="meta">
        <span :class="['tag', venueColor]">{{ paper.venue }} {{ paper.year }}</span>
        <a
          v-if="paper.doi"
          :href="`https://doi.org/${paper.doi}`"
          target="_blank"
          rel="noopener"
          class="doi-badge"
          title="点击打开 DOI 链接"
          @click.stop
        >DOI: {{ paper.doi }}</a>
        <span v-for="kw in (paper.keywords || []).slice(0, 3)" :key="kw" class="tag" style="background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);color:#cbd5e1">{{ kw }}</span>
      </div>
      <h3 class="paper-title">
        <RouterLink :to="`/paper/${paper.id}`">{{ paper.title }}</RouterLink>
      </h3>
      <p v-if="!compact" class="paper-authors muted">
        {{ (paper.authors || []).slice(0, 5).join(', ') }}{{ (paper.authors || []).length > 5 ? ' ...' : '' }}
      </p>
    </header>
    <p v-if="!compact" class="paper-abstract">{{ (paper.abstract || '').slice(0, 220) }}{{ (paper.abstract || '').length > 220 ? '...' : '' }}</p>
    <footer class="paper-foot">
      <a v-if="paper.url" :href="paper.url" target="_blank" rel="noopener" class="btn btn-sm btn-ghost">↗ 原文链接</a>
      <RouterLink :to="`/paper/${paper.id}`" class="btn btn-sm btn-ghost">详情</RouterLink>
      <slot name="actions">
        <button class="btn btn-sm" @click="$emit('edit', paper)">编辑</button>
        <button class="btn btn-sm btn-danger" @click="$emit('delete', paper)">删除</button>
      </slot>
    </footer>
  </article>
</template>

<style scoped>
.paper-card {
  padding: 18px 20px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--c-border);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.paper-card:hover {
  transform: translateY(-2px);
  border-color: rgba(124, 58, 237, 0.4);
  background: rgba(255, 255, 255, 0.07);
}
.paper-card.compact {
  padding: 12px 14px;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.paper-title {
  font-size: 16px;
  margin: 0;
  line-height: 1.4;
}
.paper-title a {
  color: var(--c-text);
}
.paper-title a:hover {
  color: var(--c-accent-2);
}
.paper-authors {
  margin: 4px 0 0;
  font-size: 12px;
}
.paper-abstract {
  margin: 0;
  color: var(--c-text-dim);
  font-size: 13px;
  line-height: 1.6;
}
.paper-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.doi-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  background: rgba(124, 58, 237, 0.18);
  color: #c4b5fd;
  border: 1px solid rgba(124, 58, 237, 0.3);
  font-weight: 600;
  font-family: var(--font-mono);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background 0.18s ease;
}
.doi-badge:hover {
  background: rgba(124, 58, 237, 0.32);
  color: #fff;
}
</style>