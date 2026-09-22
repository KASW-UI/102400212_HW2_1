<script setup>
/**
 * Top10 热门方向（功能 3）+ 附加功能：年度热词演变
 *
 * 数据：/api/top（关键词频次）+ 跨年统计
 */
import { ref, computed, onMounted, watch } from 'vue'
import { usePapersStore } from '@/store/papers'
import { api } from '@/services/api'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent
} from 'echarts/components'

use([CanvasRenderer, BarChart, LineChart, RadarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent])

const store = usePapersStore()
const topN = ref(10)
const venue = ref('ALL')
const topData = ref([])
const yearData = ref({}) // {year: [{keyword, count}]}

onMounted(async () => {
  await store.load()
  await refresh()
})

async function refresh() {
  topData.value = await api.top({ topN: topN.value, venue: venue.value })
  await refreshYearly()
}

async function refreshYearly() {
  const allPapers = store.papers
  const years = [...new Set(allPapers.map((p) => p.year))].sort()
  const data = {}
  for (const y of years) {
    const inYear = allPapers.filter((p) => p.year === y)
    data[y] = await api.top({ topN: 8, venue: venue.value }).then((rows) => {
      // 只取在该年出现的
      const set = new Set(
        inYear.flatMap((p) => p.keywords || []).map((k) => k.toLowerCase())
      )
      return rows
        .map((r) => ({ ...r, count: inYear.filter((p) => (p.keywords || []).map((k) => k.toLowerCase()).includes(r.keyword)).length }))
        .filter((r) => r.count > 0)
        .slice(0, 8)
    })
  }
  yearData.value = data
}

watch([topN, venue], () => refresh())

const barOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 12, right: 24, top: 16, bottom: 30, containLabel: true },
  xAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLabel: { color: '#cbd5e1' }
  },
  yAxis: {
    type: 'category',
    data: topData.value.map((d) => d.keyword).reverse(),
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
    axisLabel: { color: '#cbd5e1', fontSize: 12 }
  },
  series: [
    {
      type: 'bar',
      data: topData.value.map((d) => d.count).reverse(),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#7c3aed' },
            { offset: 1, color: '#5b8def' }
          ]
        },
        borderRadius: [0, 6, 6, 0]
      },
      label: { show: true, position: 'right', color: '#cbd5e1' }
    }
  ]
}))

const radarOption = computed(() => {
  const top = topData.value.slice(0, 8)
  const indicators = top.map((t) => ({ name: t.keyword, max: Math.max(...top.map((x) => x.count)) + 2 }))
  const venues = ['CVPR', 'ICCV', 'ECCV']
  const series = venues.map((v) => ({
    name: v,
    value: top.map((t) => t.byVenue?.[v] || 0)
  }))
  return {
    backgroundColor: 'transparent',
    tooltip: {},
    legend: { bottom: 0, textStyle: { color: '#cbd5e1' } },
    radar: {
      indicator: indicators,
      axisName: { color: '#cbd5e1', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitArea: { areaStyle: { color: ['rgba(91,141,239,0.04)', 'rgba(124,58,237,0.04)'] } }
    },
    series: [
      {
        type: 'radar',
        data: series.map((s, i) => ({
          name: s.name,
          value: s.value,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.18 }
        }))
      }
    ]
  }
})

// 年度热词演变（多 line）
const evolutionOption = computed(() => {
  const years = Object.keys(yearData.value).map(String).sort()
  const kws = new Set()
  for (const y of years) for (const r of yearData.value[y] || []) kws.add(r.keyword)
  const keywords = [...kws].slice(0, 8)
  const series = keywords.map((kw) => ({
    name: kw,
    type: 'line',
    smooth: true,
    data: years.map((y) => {
      const rows = yearData.value[y] || []
      return rows.find((r) => r.keyword === kw)?.count || 0
    })
  }))
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#cbd5e1' } },
    grid: { left: 40, right: 16, top: 30, bottom: 50 },
    xAxis: {
      type: 'category',
      data: years,
      axisLabel: { color: '#cbd5e1' },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
    },
    series
  }
})
</script>

<template>
  <section>
    <header>
      <h1 class="h1">Top10 热门研究方向</h1>
      <p class="muted">基于论文关键词频次。点击关键词可跳转图谱下钻查看相关论文。</p>
    </header>

    <div class="glass card" style="margin-top:16px">
      <div class="filters">
        <div>
          <label class="field-label">Top N</label>
          <select v-model.number="topN" class="select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
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

    <div class="grid-2" style="margin-top:16px">
      <div class="glass card">
        <h2 class="section-title">热门关键词排行</h2>
        <p class="section-sub">按当前库内频次排序，可联动下方雷达图与年度演变</p>
        <div style="height:380px">
          <v-chart v-if="topData.length" :option="barOption" autoresize />
        </div>
      </div>
      <div class="glass card">
        <h2 class="section-title">三会雷达对比</h2>
        <p class="section-sub">同一关键词在 CVPR / ICCV / ECCV 的分布差异</p>
        <div style="height:380px">
          <v-chart v-if="topData.length" :option="radarOption" autoresize />
        </div>
      </div>
    </div>

    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">📈 年度热词演变（附加功能）</h2>
      <p class="section-sub">展示关键词在历年的频次变化。每个点 = 该年关键词出现次数。</p>
      <div style="height:380px">
        <v-chart v-if="Object.keys(yearData).length" :option="evolutionOption" autoresize />
      </div>
    </div>

    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">关键词明细</h2>
      <table class="table">
        <thead>
          <tr><th>#</th><th>关键词</th><th>频次</th><th>CVPR</th><th>ICCV</th><th>ECCV</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in topData" :key="row.keyword">
            <td>{{ i + 1 }}</td>
            <td><strong>{{ row.keyword }}</strong></td>
            <td>{{ row.count }}</td>
            <td>{{ row.byVenue?.CVPR || 0 }}</td>
            <td>{{ row.byVenue?.ICCV || 0 }}</td>
            <td>{{ row.byVenue?.ECCV || 0 }}</td>
          </tr>
        </tbody>
      </table>
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
  width: 140px;
}
</style>