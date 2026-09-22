<script setup>
/**
 * 首页：CV 三会总览 + Top10 概览 + 趋势缩略图。
 * 一次性把所有数据拉齐后渲染，路由跳转不重复请求。
 */
import { onMounted, computed } from 'vue'
import { usePapersStore } from '@/store/papers'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'

use([CanvasRenderer, BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const store = usePapersStore()
onMounted(() => store.load())

const topOption = computed(() => {
  const byVenue = store.stats.byVenue || []
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#cbd5e1' } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 6, borderColor: '#0a0f1f', borderWidth: 2 },
        label: { color: '#e7eaf3' },
        data: byVenue.map((d) => ({ name: d.venue, value: d.n }))
      }
    ]
  }
})

const yearOption = computed(() => {
  const byYear = store.stats.byYear || []
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: 30, right: 16, top: 16, bottom: 30 },
    xAxis: {
      type: 'category',
      data: byYear.map((y) => String(y.year)),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#cbd5e1' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#cbd5e1' }
    },
    series: [
      {
        type: 'bar',
        data: byYear.map((y) => y.n),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#5b8def' },
              { offset: 1, color: '#7c3aed' }
            ]
          },
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  }
})
</script>

<template>
  <section>
    <div class="hero glass card">
      <h1 class="h1">CV 三会论文趋势分析</h1>
      <p class="muted" style="max-width:760px">
        聚合 <strong>CVPR</strong> / <strong>ICCV</strong> / <strong>ECCV</strong> 近年顶会论文，
        通过关键词抽取与热度统计，把论文库变成可下钻的趋势地图。
        支持论文爬取、列表管理、Top10、关键词图谱、跨年走势对比——打开浏览器即可用。
      </p>
      <div class="grid-4" style="margin-top:18px">
        <div class="stat">
          <div class="stat-value">{{ store.stats.total }}</div>
          <div class="stat-label">论文总数</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ (store.stats.byVenue || []).length }}</div>
          <div class="stat-label">覆盖会议</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ (store.stats.byYear || []).length }}</div>
          <div class="stat-label">覆盖年份</div>
        </div>
        <div class="stat">
          <div class="stat-value">5+2</div>
          <div class="stat-label">基础+扩展功能</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top:24px">
      <div class="glass card">
        <h2 class="section-title">各会议论文占比</h2>
        <p class="section-sub">基于当前平台收录论文的会议维度计数</p>
        <div style="height:260px">
          <v-chart v-if="store.stats.total > 0" :option="topOption" autoresize />
          <div v-else class="empty">暂无数据</div>
        </div>
      </div>
      <div class="glass card">
        <h2 class="section-title">论文数量年度分布</h2>
        <p class="section-sub">看近年 CV 三会规模走势</p>
        <div style="height:260px">
          <v-chart v-if="store.stats.total > 0" :option="yearOption" autoresize />
          <div v-else class="empty">暂无数据</div>
        </div>
      </div>
    </div>

    <div class="glass card" style="margin-top:24px">
      <h2 class="section-title">核心能力</h2>
      <div class="grid-3" style="margin-top:8px">
        <div class="feat">
          <div class="feat-icon">↧</div>
          <h3>论文爬取 / 导入</h3>
          <p class="muted">单篇输入或批量导入论文列表，自动从本地库 + DBLP 拉取元数据（标题/摘要/关键词/原文链接）。</p>
          <router-link to="/crawl" class="btn btn-sm btn-primary">立即体验</router-link>
        </div>
        <div class="feat">
          <div class="feat-icon">✎</div>
          <h3>论文管理</h3>
          <p class="muted">对论文库做增删改查；模糊查询不命中时自动爬取并返回。</p>
          <router-link to="/manage" class="btn btn-sm btn-primary">立即体验</router-link>
        </div>
        <div class="feat">
          <div class="feat-icon">★</div>
          <h3>Top10 热门</h3>
          <p class="muted">基于关键词频次的 Top10 热门研究领域，可按会议筛选。</p>
          <router-link to="/top10" class="btn btn-sm btn-primary">立即体验</router-link>
        </div>
        <div class="feat">
          <div class="feat-icon">◌</div>
          <h3>关键词图谱</h3>
          <p class="muted">点击节点下钻相关论文；颜色深浅代表频次。</p>
          <router-link to="/graph" class="btn btn-sm btn-primary">立即体验</router-link>
        </div>
        <div class="feat">
          <div class="feat-icon">↗</div>
          <h3>热度走势</h3>
          <p class="muted">多年 × 多会议的热词走势动图，支持播放/暂停。</p>
          <router-link to="/trend" class="btn btn-sm btn-primary">立即体验</router-link>
        </div>
        <div class="feat">
          <div class="feat-icon">ⓘ</div>
          <h3>了解更多</h3>
          <p class="muted">介绍 CV 三会、统计口径、项目组成与数据来源。</p>
          <router-link to="/about" class="btn btn-sm">前往</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
}
.hero::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, rgba(91, 141, 239, 0.15), transparent 50%);
  pointer-events: none;
  border-radius: inherit;
}
.feat {
  padding: 18px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feat h3 {
  margin: 0;
  font-size: 15px;
}
.feat p {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  flex: 1;
}
.feat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--c-accent-2), var(--c-accent));
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
}
</style>