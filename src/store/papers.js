/**
 * Pinia store：论文数据 + 视图状态。
 *
 * 数据流：
 *   1) 组件 mount 时调 load() 拉全量列表（用作本地缓存 + 计算用）
 *   2) 增删改 / 爬取 → 调后端 → 本地状态同步更新
 *   3) 派生数据（Top10 / Graph / Trend）走专门 API，每次刷新页面或筛选变化时重拉
 */
import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const usePapersStore = defineStore('papers', {
  state: () => ({
    papers: [],
    stats: { total: 0, byVenue: [], byYear: [] },
    loading: false,
    error: null,
    lastCrawl: null
  }),

  getters: {
    venues: (s) => [...new Set(s.papers.map((p) => p.venue))].sort(),
    years: (s) => [...new Set(s.papers.map((p) => p.year))].sort((a, b) => b - a),
    findById: (s) => (id) => s.papers.find((p) => p.id === id)
  },

  actions: {
    async load(force = false) {
      if (this.papers.length && !force) return
      this.loading = true
      this.error = null
      try {
        const [papers, stats] = await Promise.all([api.papers.list(), api.stats()])
        this.papers = papers
        this.stats = stats
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async add(paper) {
      const saved = await api.papers.create(paper)
      // 替换或插入
      const idx = this.papers.findIndex((p) => p.id === saved.id)
      if (idx >= 0) this.papers.splice(idx, 1, saved)
      else this.papers.push(saved)
      this.lastCrawl = saved
      await this.refreshStats()
      return saved
    },

    async update(id, patch) {
      const saved = await api.papers.update(id, patch)
      const idx = this.papers.findIndex((p) => p.id === id)
      if (idx >= 0) this.papers.splice(idx, 1, saved)
      return saved
    },

    async remove(id) {
      await api.papers.remove(id)
      this.papers = this.papers.filter((p) => p.id !== id)
      await this.refreshStats()
    },

    async crawl(titles) {
      const data = await api.crawl(titles)
      // 把 results 里没有 error 的写进本地
      for (const p of data.results) {
        if (p.error) continue
        const idx = this.papers.findIndex((x) => x.id === p.id)
        if (idx >= 0) this.papers.splice(idx, 1, p)
        else this.papers.push(p)
      }
      this.lastCrawl = data.results.find((p) => !p.error) || null
      await this.refreshStats()
      return data
    },

    async search({ q, venue, year, crawl }) {
      return await api.search({ q, venue, year, crawl })
    },

    async refreshStats() {
      this.stats = await api.stats()
    }
  }
})