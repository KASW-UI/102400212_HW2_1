/**
 * 前端 API 调用层 —— 静态化版本（适配 GitHub Pages 部署）。
 *
 * 设计：
 *   - 读路径全部走 build 时预生成的 /papers.json
 *   - 关键词统计（top/graph/trend）由前端 utils/keywords.js 实时计算
 *   - 写路径（增/改/删/爬取）禁用——演示模式下抛错，避免静默失败
 *   - 分享改为 localStorage（key: cvp_share_<id>），不依赖后端
 */

import { topKeywords, keywordGraph, trendByYear, extractKeywords } from '@/utils/keywords'

let _cache = null

/**
 * 懒加载论文全集
 */
async function loadAll() {
  if (_cache) return _cache
  const res = await fetch(`${import.meta.env.BASE_URL}papers.json`)
  if (!res.ok) throw new Error(`无法加载 papers.json (HTTP ${res.status})`)
  _cache = await res.json()
  return _cache
}

function applyFilters(papers, { venue, year, q } = {}) {
  let out = papers
  if (venue && venue !== 'ALL') out = out.filter((p) => p.venue === venue)
  if (year) out = out.filter((p) => Number(p.year) === Number(year))
  if (q) {
    const qq = q.toLowerCase()
    out = out.filter((p) =>
      (p.title || '').toLowerCase().includes(qq) ||
      (p.keywords || []).some((k) => k.toLowerCase().includes(qq)) ||
      (p.abstract || '').toLowerCase().includes(qq) ||
      (p.authors || []).some((a) => a.toLowerCase().includes(qq))
    )
  }
  return out
}

export const api = {
  health: async () => {
    const papers = await loadAll()
    return { uptime: 0, papers: papers.length }
  },

  stats: async () => {
    const papers = await loadAll()
    const byVenue = {}
    const byYear = {}
    for (const p of papers) {
      byVenue[p.venue] = (byVenue[p.venue] || 0) + 1
      byYear[p.year] = (byYear[p.year] || 0) + 1
    }
    return {
      total: papers.length,
      byVenue: Object.entries(byVenue).map(([venue, n]) => ({ venue, n })).sort((a, b) => b.n - a.n),
      byYear: Object.entries(byYear).map(([year, n]) => ({ year: Number(year), n })).sort((a, b) => a.year - b.year),
    }
  },

  papers: {
    list: async (params = {}) => {
      const papers = await loadAll()
      const filtered = applyFilters(papers, params)
      return filtered.sort((a, b) => b.year - a.year || (a.title || '').localeCompare(b.title || ''))
    },
    get: async (id) => {
      const papers = await loadAll()
      return papers.find((p) => p.id === id) || null
    },
    // 写操作：演示模式禁用
    create: async () => {
      throw new Error('演示模式：GitHub Pages 部署不支持增删改')
    },
    update: async () => {
      throw new Error('演示模式：GitHub Pages 部署不支持增删改')
    },
    remove: async () => {
      throw new Error('演示模式：GitHub Pages 部署不支持增删改')
    },
  },

  search: async ({ q, venue, year }) => {
    // 兼容旧契约：返回 { mode, matches, crawled }
    // GitHub Pages 静态模式下没有"联网爬取"，crawled 永远是 null
    if (!q) return { mode: 'empty', matches: [], crawled: null }
    const papers = await loadAll()
    const matches = applyFilters(papers, { q, venue, year }).slice(0, 50)
    return {
      mode: matches.length ? 'local' : 'empty',
      matches,
      crawled: null,
    }
  },

  crawl: async () => {
    throw new Error('演示模式：GitHub Pages 部署不支持爬取')
  },

  top: async ({ topN = 10, venue = 'ALL' } = {}) => {
    const papers = await loadAll()
    const subset = venue && venue !== 'ALL' ? papers.filter((p) => p.venue === venue) : papers
    return topKeywords(subset, { topN })
  },

  graph: async ({ topN = 25, minCo = 2, venue = 'ALL' } = {}) => {
    const papers = await loadAll()
    const subset = venue && venue !== 'ALL' ? papers.filter((p) => p.venue === venue) : papers
    return keywordGraph(subset, { topN, minCo })
  },

  trend: async ({ topN = 6 } = {}) => {
    const papers = await loadAll()
    return trendByYear(papers, { topN })
  },

  // 分享：localStorage 版（不依赖后端）
  share: {
    create: async (payload) => {
      const id = Math.random().toString(36).slice(2, 10)
      try {
        localStorage.setItem(`cvp_share_${id}`, JSON.stringify(payload))
      } catch {}
      return id
    },
    get: async (id) => {
      try {
        const raw = localStorage.getItem(`cvp_share_${id}`)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    },
  },
}