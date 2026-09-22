<script setup>
/**
 * 热度走势对比（功能 5）—— 多年 × 多会议 × 多关键词。
 *
 *  - 静态折线：所有年份一次性展示
 *  - 动图模式（核心展示项）：把"年份"做成播放轴，每帧只显示到当前年份；
 *    通过 ECharts 动画 + requestAnimationFrame 实现"动图"效果
 *  - 提供"录制为 GIF 序列"按钮：把所有帧转成图片序列，方便博客嵌入
 */
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { usePapersStore } from '@/store/papers'
import { api } from '@/services/api'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  TimelineComponent,
  MarkPointComponent
} from 'echarts/components'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, TimelineComponent, MarkPointComponent])

const store = usePapersStore()
const topN = ref(5)
const data = ref({ keywords: [], years: [], series: [] })
const frameIndex = ref(0)
const playing = ref(false)
const speed = ref(800) // ms per frame
const frames = ref([])   // 录制的图序列（每帧一个 dataURL）

let timer = null

onMounted(async () => {
  await store.load()
  await refresh()
})

async function refresh() {
  data.value = await api.trend({ topN: topN.value })
  frameIndex.value = 0
}

watch(topN, () => refresh())

function play() {
  if (playing.value || data.value.years.length === 0) return
  playing.value = true
  timer = setInterval(() => {
    if (frameIndex.value >= data.value.years.length - 1) {
      pause()
      return
    }
    frameIndex.value++
  }, speed.value)
}

function pause() {
  playing.value = false
  if (timer) clearInterval(timer)
  timer = null
}

function stepBack() {
  pause()
  if (frameIndex.value > 0) frameIndex.value--
}

function stepForward() {
  pause()
  if (frameIndex.value < data.value.years.length - 1) frameIndex.value++
}

onUnmounted(() => pause())

// 动图模式：只画到当前 frameIndex 的年份
const dynamicOption = computed(() => {
  const curYear = data.value.years[frameIndex.value] ?? data.value.years[0]
  const series = data.value.series.map((s) => ({
    name: s.name,
    type: 'line',
    smooth: true,
    showSymbol: true,
    lineStyle: { width: 2 },
    data: s.data.filter(([y]) => y <= curYear),
    animationDuration: 400
  }))
  return {
    backgroundColor: 'transparent',
    title: {
      text: `截至 ${curYear} 年`,
      left: 'center',
      textStyle: { color: '#cbd5e1', fontSize: 14, fontWeight: 'normal' }
    },
    tooltip: { trigger: 'axis' },
    legend: {
      type: 'scroll',
      bottom: 0,
      textStyle: { color: '#cbd5e1', fontSize: 10 }
    },
    grid: { left: 40, right: 24, top: 40, bottom: 60 },
    xAxis: {
      type: 'value',
      name: '年',
      min: Math.min(...data.value.years),
      max: Math.max(...data.value.years),
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
    },
    yAxis: {
      type: 'value',
      name: '热度',
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
    },
    series
  }
})

// 全量静态图（保留）
const fullOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: { type: 'scroll', bottom: 0, textStyle: { color: '#cbd5e1', fontSize: 11 } },
  grid: { left: 40, right: 24, top: 20, bottom: 60 },
  xAxis: {
    type: 'category',
    data: data.value.years,
    axisLabel: { color: '#cbd5e1' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#cbd5e1' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
  },
  series: data.value.series.map((s) => ({
    name: s.name,
    type: 'line',
    smooth: true,
    showSymbol: true,
    data: s.data.map(([, v]) => v)
  }))
}))

const keywordSummary = computed(() => {
  const map = {}
  for (const s of data.value.series) {
    if (!map[s.keyword]) map[s.keyword] = { keyword: s.keyword, total: 0 }
    map[s.keyword].total += s.data.reduce((a, [, v]) => a + v, 0)
  }
  return Object.values(map).sort((a, b) => b.total - a.total)
})

/** 录制动图：逐帧截屏并存为 dataURL */
async function recordFrames() {
  pause()
  frames.value = []
  // 等动画完成
  await new Promise((r) => setTimeout(r, 200))
  const chartHost = document.querySelector('.chart-stage')
  if (!chartHost) return
  const canvas = chartHost.querySelector('canvas')
  if (!canvas) return
  for (let i = 0; i < data.value.years.length; i++) {
    frameIndex.value = i
    await new Promise((r) => setTimeout(r, 500)) // 等动画完成
    frames.value.push(canvas.toDataURL('image/png'))
  }
}

async function downloadFrames() {
  if (frames.value.length === 0) {
    alert('请先点击"录制动图"生成帧')
    return
  }
  // 简单打包为 tar 不可行；改为逐张下载
  for (let i = 0; i < frames.value.length; i++) {
    const a = document.createElement('a')
    a.href = frames.value[i]
    a.download = `trend-frame-${i + 1}.png`
    a.click()
    await new Promise((r) => setTimeout(r, 80))
  }
}
</script>

<template>
  <section>
    <header>
      <h1 class="h1">热度走势对比</h1>
      <p class="muted">
        多年 × 多会议的热词走势。点击「▶ 播放」即可看到「动图」效果；
        可录制帧序列嵌入博客。
      </p>
    </header>

    <div class="glass card" style="margin-top:16px">
      <div class="filters">
        <div>
          <label class="field-label">Top 关键词数</label>
          <select v-model.number="topN" class="select">
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="8">8</option>
          </select>
        </div>
        <div>
          <label class="field-label">速度（ms/帧）</label>
          <input v-model.number="speed" type="number" class="input" min="200" max="2000" step="100" />
        </div>
      </div>
    </div>

    <div class="glass card" style="margin-top:16px">
      <div class="player">
        <button class="btn btn-primary" @click="playing ? pause() : play()">
          {{ playing ? '⏸ 暂停' : '▶ 播放动图' }}
        </button>
        <button class="btn" @click="stepBack">⏮</button>
        <button class="btn" @click="stepForward">⏭</button>
        <input
          type="range"
          min="0"
          :max="data.years.length - 1"
          v-model.number="frameIndex"
          style="flex:1"
        />
        <span class="tiny" style="width:90px;text-align:center">
          {{ data.years[frameIndex] || '-' }}
        </span>
        <button class="btn" @click="recordFrames">📷 录制帧</button>
        <button class="btn" :disabled="!frames.length" @click="downloadFrames">⬇ 下载帧 ({{ frames.length }})</button>
      </div>

      <div class="chart-stage" style="height:480px; margin-top:12px">
        <v-chart v-if="data.years.length" :option="dynamicOption" autoresize />
        <div v-else class="empty">暂无数据</div>
      </div>

      <p class="tiny" style="margin-top:6px">
        统计口径：词频 = 关键词在该年该会议出现次数。3 个顶会对比，颜色按关键词分组。
      </p>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="glass card">
        <h2 class="section-title">全量静态走势</h2>
        <div style="height:340px">
          <v-chart v-if="data.years.length" :option="fullOption" autoresize />
        </div>
      </div>
      <div class="glass card">
        <h2 class="section-title">关键词累计热度</h2>
        <table class="table">
          <thead><tr><th>#</th><th>关键词</th><th>累计</th></tr></thead>
          <tbody>
            <tr v-for="(row, i) in keywordSummary" :key="row.keyword">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ row.keyword }}</strong></td>
              <td>{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="frames.length" class="glass card" style="margin-top:16px">
      <h2 class="section-title">录制的帧（可直接截图合成 GIF）</h2>
      <div class="frames-grid">
        <img v-for="(src, i) in frames" :key="i" :src="src" :alt="`frame-${i + 1}`" />
      </div>
      <p class="tiny" style="margin-top:8px">
        提示：使用任意录屏工具（如 QuickTime / OBS）录制「▶ 播放」过程导出 GIF；
        或用上面 <strong>⬇ 下载帧</strong> 获得 PNG 序列后用 ffmpeg 合成：
        <code>ffmpeg -framerate 4 -i trend-frame-%d.png -vf "palettegen" palette.png && ffmpeg -framerate 4 -i trend-frame-%d.png -i palette.png -lavfi paletteuse trend.gif</code>
      </p>
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
  width: 180px;
}
.player {
  display: flex;
  gap: 8px;
  align-items: center;
}
.frames-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}
.frames-grid img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--c-border);
}
code {
  background: rgba(0, 0, 0, 0.35);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
}
</style>