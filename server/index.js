/**
 * Express 服务入口。
 *
 * 路由：
 *   GET    /api/health
 *   GET    /api/papers
 *   GET    /api/papers/:id
 *   POST   /api/papers            (新增 / upsert)
 *   PUT    /api/papers/:id
 *   DELETE /api/papers/:id
 *   GET    /api/search?q=&venue=&year=
 *   POST   /api/crawl            (单/批量爬取)
 *   GET    /api/top?topN=&venue=
 *   GET    /api/graph?topN=&minCo=
 *   GET    /api/trend?topN=
 *   GET    /api/stats
 *   POST   /api/share             body: { payload }
 *   GET    /api/share/:id
 *
 *   静态文件（前端 SPA）：dist/ 目录（构建后存在）
 */
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import { db, papersRepo, sharesRepo } from './db.js'
import { seedIfEmpty } from './seed.js'
import { crawlPaperByTitle, crawlBatch } from './crawler.js'
import { topKeywords, keywordGraph, trendByYear } from './keywords.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '0.0.0.0'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// 启动种子（仅当数据库为空）
const seeded = seedIfEmpty(papersRepo)
if (seeded > 0) console.log(`[seed] 写入 ${seeded} 篇初始论文`)

// ---------------- 工具 ----------------
const ok = (data) => ({ ok: true, data })
const fail = (msg, code = 400) => ({ ok: false, error: msg, code })

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json(ok({ uptime: process.uptime(), papers: papersRepo.count() }))
})

// 论文列表
app.get('/api/papers', (req, res) => {
  const { venue, year, q } = req.query
  res.json(ok(papersRepo.list({ venue, year: year ? Number(year) : undefined, q })))
})

// 论文详情
app.get('/api/papers/:id', (req, res) => {
  const p = papersRepo.get(req.params.id)
  if (!p) return res.status(404).json(fail('not found', 404))
  res.json(ok(p))
})

// 新增 / 覆盖
app.post('/api/papers', (req, res) => {
  const paper = req.body
  if (!paper?.title || !paper?.venue || !paper?.year) {
    return res.status(400).json(fail('title/venue/year required'))
  }
  if (!paper?.doi || !paper.doi.trim()) {
    return res.status(400).json(fail('doi required'))
  }
  if (!paper.id) {
    paper.id = `${paper.venue.toLowerCase()}${paper.year}-${slug(paper.doi)}`
  }
  res.json(ok(papersRepo.upsert(paper)))
})

// 更新
app.put('/api/papers/:id', (req, res) => {
  const existed = papersRepo.get(req.params.id)
  if (!existed) return res.status(404).json(fail('not found', 404))
  const merged = { ...existed, ...req.body, id: req.params.id }
  res.json(ok(papersRepo.upsert(merged)))
})

// 删除
app.delete('/api/papers/:id', (req, res) => {
  const removed = papersRepo.remove(req.params.id)
  if (!removed) return res.status(404).json(fail('not found', 404))
  res.json(ok({ id: req.params.id, removed: true }))
})

// 查询：精确 → 模糊 → 爬取
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim()
  const venue = req.query.venue?.toString()
  const year = req.query.year ? Number(req.query.year) : undefined
  const crawl = req.query.crawl !== '0' // 默认允许爬取

  if (!q) return res.json(ok({ matches: [], crawled: null }))

  // 1) 精确匹配：DOI 或 标题
  if (looksLikeDOI(q)) {
    const exact = papersRepo.findByDOI(q)
    if (exact) return res.json(ok({ matches: [exact], crawled: null, mode: 'doi' }))
  }
  const exact = papersRepo.findByTitle(q)
  if (exact) {
    return res.json(ok({ matches: [exact], crawled: null, mode: 'exact' }))
  }

  // 2) 模糊匹配
  const fuzzy = papersRepo.fuzzySearch(q, { venue, year })
  if (fuzzy.length > 0) {
    return res.json(ok({ matches: fuzzy, crawled: null, mode: 'fuzzy' }))
  }

  // 3) 爬取
  if (crawl) {
    try {
      const crawled = await crawlPaperByTitle(q)
      return res.json(ok({ matches: [], crawled, mode: 'crawled' }))
    } catch (e) {
      return res.status(502).json(fail('crawl failed: ' + e.message, 502))
    }
  }
  res.json(ok({ matches: [], crawled: null, mode: 'none' }))
})

// 批量爬取 / 导入
app.post('/api/crawl', async (req, res) => {
  const titles = Array.isArray(req.body?.titles) ? req.body.titles : []
  if (titles.length === 0) return res.status(400).json(fail('titles[] required'))
  const results = await crawlBatch(titles)
  // 把成功爬到的写入 DB
  let inserted = 0
  for (const p of results) {
    if (p && !p.error) {
      papersRepo.upsert(p)
      inserted++
    }
  }
  res.json(ok({ results, inserted }))
})

// Top N 热门关键词
app.get('/api/top', (req, res) => {
  const topN = Number(req.query.topN) || 10
  const venue = req.query.venue?.toString()
  let papers = papersRepo.list()
  if (venue && venue !== 'ALL') papers = papers.filter((p) => p.venue === venue)
  res.json(ok(topKeywords(papers, { topN, byVenue: true })))
})

// 关键词图谱
app.get('/api/graph', (req, res) => {
  const topN = Number(req.query.topN) || 25
  const minCo = Number(req.query.minCo) || 2
  const venue = req.query.venue?.toString()
  let papers = papersRepo.list()
  if (venue && venue !== 'ALL') papers = papers.filter((p) => p.venue === venue)
  res.json(ok(keywordGraph(papers, { topN, minCo })))
})

// 热度走势（多年 × 多会）
app.get('/api/trend', (req, res) => {
  const topN = Number(req.query.topN) || 6
  const papers = papersRepo.list()
  res.json(ok(trendByYear(papers, { topN })))
})

// 统计
app.get('/api/stats', (_req, res) => {
  res.json(ok(papersRepo.stats()))
})

// 分享链接
app.post('/api/share', (req, res) => {
  const payload = req.body || {}
  if (Object.keys(payload).length === 0) return res.status(400).json(fail('empty payload'))
  const id = sharesRepo.create(payload)
  res.json(ok({ id, url: `${req.protocol}://${req.get('host')}/#/share/${id}` }))
})

app.get('/api/share/:id', (req, res) => {
  const payload = sharesRepo.get(req.params.id)
  if (!payload) return res.status(404).json(fail('not found', 404))
  res.json(ok(payload))
})

// ---------------- 静态资源（SPA） ----------------
const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '1h', etag: true }))
  // SPA fallback
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
  console.log(`[static] serving ${distDir}`)
} else {
  console.warn('[static] dist/ 不存在，请先运行 npm run build')
}

// 全局错误
app.use((err, _req, res, _next) => {
  console.error('[err]', err)
  res.status(500).json(fail(err.message || 'internal error', 500))
})

app.listen(PORT, HOST, () => {
  console.log(`CV Paper Trend 服务运行在 http://${HOST}:${PORT}`)
  console.log(`  - API: http://${HOST}:${PORT}/api/health`)
  console.log(`  - Web: http://${HOST}:${PORT}/`)
})

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function looksLikeDOI(s) {
  return /^10\.\d{4,9}\/\S+$/i.test(s)
}