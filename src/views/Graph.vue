<script setup>
/**
 * 关键词图谱（功能 4）。
 *
 *  - 力导向图：节点=Top 关键词，边=共现次数
 *  - 节点大小 / 边粗细映射频次
 *  - 点击节点 → 在右侧列出包含该关键词的论文（"下钻"）
 */
import { ref, computed, onMounted, watch } from 'vue'
import { usePapersStore } from '@/store/papers'
import { api } from '@/services/api'
import { RouterLink } from 'vue-router'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GraphChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'

use([CanvasRenderer, GraphChart, TitleComponent, TooltipComponent])

const store = usePapersStore()
const graphData = ref({ nodes: [], links: [] })
const topN = ref(25)
const minCo = ref(2)
const venue = ref('ALL')
const selectedKeyword = ref(null)

onMounted(async () => {
  await store.load()
  await refresh()
})

async function refresh() {
  graphData.value = await api.graph({ topN: topN.value, minCo: minCo.value, venue: venue.value })
  if (selectedKeyword.value && !graphData.value.nodes.find((n) => n.id === selectedKeyword.value)) {
    selectedKeyword.value = null
  }
}

watch([topN, minCo, venue], () => refresh())

const option = computed(() => {
  const { nodes, links } = graphData.value
  return {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (p) => {
        if (p.dataType === 'edge') return `共现：${p.data.value}`
        return `<strong>${p.name}</strong><br/>频次：${p.value}`
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        data: nodes.map((n) => ({
          id: n.id,
          name: n.name,
          value: n.value,
          symbolSize: Math.max(10, Math.min(40, 8 + Math.log2(n.value + 1) * 8)),
          label: { show: true, color: '#e7eaf3', fontSize: 11 }
        })),
        links: links.map((l) => ({ ...l, lineStyle: { width: Math.min(6, l.value) } })),
        categories: [{ name: '关键词', itemStyle: { color: '#7c3aed' } }],
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
          label: { fontWeight: 700 }
        },
        force: {
          repulsion: 220,
          edgeLength: 80,
          gravity: 0.05
        },
        lineStyle: { color: 'rgba(91, 141, 239, 0.4)', curveness: 0.1 }
      }
    ]
  }
})

function onChartClick(params) {
  if (params.dataType === 'node') {
    selectedKeyword.value = params.name
  }
}

const relatedPapers = computed(() => {
  if (!selectedKeyword.value) return []
  const k = selectedKeyword.value.toLowerCase()
  return store.papers.filter((p) =>
    (p.keywords || []).some((kw) => kw.toLowerCase() === k) ||
    (p.title + ' ' + (p.abstract || '')).toLowerCase().includes(k)
  )
})
</script>

<template>
  <section>
    <header>
      <h1 class="h1">关键词图谱</h1>
      <p class="muted">点击节点 → 在右侧下钻查看相关论文。边=共现次数；大小=出现频次。</p>
    </header>

    <div class="glass card" style="margin-top:16px">
      <div class="filters">
        <div>
          <label class="field-label">节点数（Top N）</label>
          <select v-model.number="topN" class="select">
            <option :value="15">15</option>
            <option :value="25">25</option>
            <option :value="40">40</option>
          </select>
        </div>
        <div>
          <label class="field-label">最小共现次数</label>
          <select v-model.number="minCo" class="select">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
          </select>
        </div>
        <div>
          <label class="field-label">会议</label>
          <select v-model="venue" class="select">
            <option value="ALL">全部</option>
            <option>CVPR</option><option>ICCV</option><option>ECCV</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid-2-1" style="margin-top:16px">
      <div class="glass card">
        <h2 class="section-title">共现图谱</h2>
        <p class="section-sub">节点越大 → 频次越高；边越粗 → 共现越强</p>
        <div class="chart-host">
          <v-chart v-if="graphData.nodes.length" :option="option" autoresize @click="onChartClick" />
          <div v-else class="empty">暂无数据</div>
        </div>
      </div>
      <div class="glass card">
        <h2 class="section-title">下钻：{{ selectedKeyword || '点击节点' }}</h2>
        <p class="section-sub">包含该关键词的论文</p>
        <div v-if="!selectedKeyword" class="empty">
          点击左侧图谱节点，这里会出现包含该关键词的论文列表
        </div>
        <div v-else-if="relatedPapers.length === 0" class="empty">未找到包含「{{ selectedKeyword }}」的论文</div>
        <div v-else class="list">
          <RouterLink
            v-for="p in relatedPapers.slice(0, 12)"
            :key="p.id"
            :to="`/paper/${p.id}`"
            class="list-row"
          >
            <div style="flex:1">
              <div style="font-weight:600">{{ p.title }}</div>
              <div class="tiny">{{ p.venue }} {{ p.year }} · {{ (p.authors || []).slice(0, 3).join(', ') }}</div>
            </div>
            <span class="btn btn-sm btn-ghost">↗</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.filters > div {
  width: 160px;
}
.grid-2-1 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
}
@media (max-width: 1100px) {
  .grid-2-1 {
    grid-template-columns: 1fr;
  }
}
.chart-host {
  height: 600px;
  position: relative;
}
</style>