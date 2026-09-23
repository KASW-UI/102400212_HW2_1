# HW2 · 与 AI 结对：CV 三会论文趋势分析平台

> **作者**：Jason · **学号**：102400212
> **作业**：软工实践 HW2（人机结对开发）
> **撰写时间**：2026-09

---

## 目录

1. [作业描述与项目仓库](#1-作业描述与项目仓库)
2. [AI 编程助手说明](#2-ai-编程助手说明)
3. [PSP 表格](#3-psp-表格)
4. [NABCD 需求分析](#4-nabcd-需求分析)
5. [原型设计与原型链接](#5-原型设计与原型链接)
6. [设计实现过程](#6-设计实现过程)
7. [代码说明（关键模块解读）](#7-代码说明关键模块解读)
8. [成品展示（≥ 10 张图）](#8-成品展示-10-张图)
9. [AI 结对协作记录（3 个代表性案例）](#9-ai-结对协作记录)
10. [心路历程与对 AI 结对伙伴的评价](#10-心路历程与对-ai-结对伙伴的评价)

---

## 1. 作业描述与项目仓库

小刚想跟踪计算机视觉顶会的研究热点，但人工读 CVPR/ICCV/ECCV 每年上千篇论文不现实。
本作业为他设计并实现一个**CV 三会论文趋势分析平台**，包含五大基础功能 + 两个附加功能：

| # | 功能 | 路径 |
| --- | --- | --- |
| 1 | 论文信息爬取（单/批） | `/crawl` |
| 2 | 论文列表管理（增删改 + 模糊查询） | `/manage` |
| 3 | Top10 热门方向 | `/top10` |
| 4 | 关键词图谱（点击下钻） | `/graph` |
| 5 | 热度走势对比（动图） | `/trend` |
| 附加 1 | 年度热词演变 | `/top10` 中 |
| 附加 2 | 了解更多 | `/about` |

**仓库地址**：

```
ssh:    git@codehub.devcloud.cn-north-4.huaweicloud.com:1545526e71ee49128bb85487ec7d32dd/102400212_HW2_1.git
https:  https://codehub.devcloud.cn-north-4.huaweicloud.com/codehub/3089368/1545526e71ee49128bb85487ec7d32dd/102400212_HW2_1
```

**代码规范**：[codestyle.md](./codestyle.md)（引用 Vue / Google / Airbnb / Express 官方规范）

**部署访问链接**（华为云 ECS）：
```
http://<ECS 公网 IP>:3000
```
本地：
```bash
cd /Users/pr/Documents/CodeArts/102400212_HW2_1
npm install && npm run build && npm start
# → http://localhost:3000
```

---

## 2. AI 编程助手说明

- **工具**：Mavis（MiniMax Code 内置 AI 编程伙伴），工作目录 `/Users/pr/.minimax/agents/mavis/`
- **模型**：MiniMax M3（thinking enabled）
- **主要用途**：
  - 需求拆解 + NABCD 头脑风暴（输出待人工筛选）
  - Vue 组件脚手架（前后端）
  - 算法迭代（关键词权重 / 共现阈值）
  - 文档撰写（README / 博客 / 代码规范）
  - 调试与 bug 排查（详见 §9 案例 C）
- **协作原则**：
  - 所有 AI 输出由我人工 review 后采纳或拒绝
  - 关键代码段我都能解释清楚（见 §7）
  - 接受「AI 起草 → 我改」的迭代节奏

---

## 3. PSP 表格

| 阶段 | 子任务 | 预估 (h) | 实际 (h) | 偏差 | 偏差分析 |
| --- | --- | --- | --- | --- | --- |
| 阶段 1 | 需求拆解 + NABCD 头脑风暴 | 1.5 | 2.0 | +0.5 | AI 输出需要逐条筛 |
| 阶段 1 | 学习 NABCD 与原型工具 | 0.5 | 0.5 | 0 | — |
| 阶段 1 | 原型草图设计 | 1.0 | 1.0 | 0 | — |
| 阶段 1 | 原型发布（用现成 web app 当 prototype） | 0.5 | 0.2 | -0.3 | web app 直接复用，跳过墨刀 |
| 阶段 2 | 仓库脚手架（package.json / vite / git） | 1.0 | 0.5 | -0.5 | 用 AI 一把过 |
| 阶段 2 | 后端：DB + 路由 + 关键词算法 | 4.0 | 5.0 | +1.0 | SQLite 选型踩坑（better-sqlite3 在 macOS Node24 缺 libc++，改用 node:sqlite） |
| 阶段 2 | 前端：5 大功能页 + 2 附加页 | 6.0 | 7.0 | +1.0 | ECharts 调试 + DOI 字段后补 |
| 阶段 2 | ECharts 图谱 + 走势动图 | 2.5 | 3.0 | +0.5 | 力导向图交互 + 动图播放器自行实现 |
| 阶段 2 | 部署到华为云 ECS | 1.0 | 0.5 | -0.5 | Node 24 安装一条命令搞定 |
| 阶段 2 | git commit 历史 + v1.0.0 release | 0.5 | 0.5 | 0 | — |
| 收尾 | 博客撰写 + 截图 + 心路 | 3.0 | 2.5 | -0.5 | — |
| **合计** | — | **21.5** | **22.7** | **+1.2** | 主要额外开销在 SQLite 选型与 ECharts |

> 偏差最大的项是后端 DB 选型 —— better-sqlite3 在本地 Node 24 上预编译二进制缺 `libc++.1.dylib`，npm rebuild 也没用。最终改用 Node 22.5+ 内置的 `node:sqlite`，零原生编译、跨平台一致。详见 §9 案例 C。

---

## 4. NABCD 需求分析

### N（Need，需求）

**目标用户**：CV 入门本科生 / 低年级研究生（选题）、博士生与科研人员（方向跟踪）、高校导师（组会开题）、企业算法工程师（预研选型）。

**核心痛点**：

1. **论文量爆炸**：CVPR 2025 投稿 13 008、接收 2 878，人工读不现实。
2. **缺乏全局视角**：不知道怎么找「近几年热门方向」。
4. **跨年/跨会走势追踪无现成方案**：现有工具要么没做，要么门槛高。
5. **单篇检索碎片化**：摘要、关键词、原文链接分散在 arXiv / 会议官网 / DBLP。

**需求性质**：Cynefin 框架下的**复杂域**——数据逐年变化，需「探索-感知-响应」迭代。

### A（Approach，做法）

直接给出五大功能 + 两个附加的交付清单（详见 §1 表）。

### B（Benefit，好处）

| 维度 | 原来 | 平台 |
| --- | --- | --- |
| 摸清 Top10 方向 | 通读 CVPR 2878 篇 × 3 分钟 ≈ 144 小时 | 秒级 |
| 查一篇论文信息 | 跨 2~3 个网站 ≈ 2 分钟 | < 5 秒 |
| 关键词趋势 | CiteSpace 安装 + 导数据 + 调参 ≈ 30~60 分钟 | 网页直接看，可点击下钻 |
| 部署 / 入门成本 | 装桌面软件 / 注册账号 | `npm start` 起服务，浏览器开 |

### C（Competitor，竞争对手）

| 竞品 | 它强 | 它弱（我们的机会） |
| --- | --- | --- |
| Google Scholar | 检索全、引用多 | 无图谱、无动图、无 CV 三会垂直 |
| Semantic Scholar | TLDR 摘要、引文图 | 全领域、不产热词趋势 |
| DBLP | 元数据权威 | 只书目、无关键词抽取、无可视化 |
| Connected Papers | 引文发现 | 不出热词图谱 |
| VOSviewer / CiteSpace | 共现 + 突现词专业 | 桌面软件、学习成本高 |
| 通用大模型（ChatGPT / Kimi） | 单篇总结 | 无持久化、不可复现、无图谱动图 |
| AMiner / 百度学术 | 学者画像 | CV 垂直不突出 |

**我们凭什么赢**：垂直深度（只做 CV 三会）+ 体验闭环（爬取→管理→Top10→图谱→走势一条链）+ 透明可复现 + 零门槛 Web + 差异化聚焦带来的低成本。

### D（Delivery，交付/推广）

- 部署到华为云 ECS / CodeArts（README 给完整流程）
- 课程内演示 + 实验室群分享
- 查询结果生成分享链接（产品内自传播）
- v1.0.0 release tag 已打（`git tag -l`）
- 数据反馈指标：查询响应时间、Top10 覆盖率、关键词命中率、用户访谈

---

## 5. 原型设计与原型链接

### 原型工具

本次直接用**已实现的 web 应用本身作为 prototype**。理由：
1. PROBLEM 允许的"原型设计"工具中包含「Balsamiq Mockup」等低保真工具，本平台虽然是高保真实现，但同样满足「与 AI 讨论信息架构、布局、文案」的设计意图；
2. 与其在墨刀/Figma 画一套与实现脱节的 mock，不如直接拿 web app 做 click-through prototype —— 部署链接即访问链接，所有交互（hover、点击、查询、动图）都能真实体验；
3. AI 在原型阶段输出了多版布局建议（如「统计卡放 hero 右侧 vs 下方」「图谱节点大小映射 log vs linear」），由人工 review 后落地到最终代码。

### 原型（live demo）链接

```
本地：http://localhost:3000
部署：http://<ECS 公网 IP>:3000
```

### 页面清单（与 §1 表对应）

1. **首页（`/`）** —— 顶会论文占比饼图 + 年度分布柱图 + 6 张能力卡
2. **爬取（`/crawl`）** —— 单篇输入 + 批量粘贴 / 文件上传
3. **管理（`/manage`）** —— 筛选条 + 论文卡列表 + 编辑/新增模态
4. **Top10（`/top10`）** —— 横条排行 + 三会雷达 + 年度折线 + 明细表
5. **图谱（`/graph`）** —— ECharts 力导向图 + 点击下钻面板
6. **走势（`/trend`）** —— 播放控件 + 动图 + 帧录制导出
7. **详情（`/paper/:id`）** —— 单篇详情，含 DOI 直跳
8. **了解（`/about`）** —— CV 三会介绍 + 统计口径

> 截图见 §8。

### 交互规则（页面间数据流转）

```
首页统计 ─── 点击饼图 / 柱图 ─→ Top10 (带筛选)
Top10   ─── 点击「关键词明细」行 ─→ 图谱 (自动定位)
图谱    ─── 点击节点 ─→ 下钻论文 ─→ 点击标题 ─→ 详情
管理    ─── 模糊查询未命中 ─→ 后端自动爬取 ─→ 「入库」按钮 ─→ 写入库
        ─── 「生成分享链接」─→ 后端 stores 表 + 短 id ─→ 复制 URL
                                              │
访问分享 URL ─→ /share/:id ─→ 后端读 payload ─→ 自动跳 /manage 并复现搜索
```

---

## 6. 设计实现过程

### 6.1 系统架构

```
┌──────────────────────────────────────────┐
│ 浏览器（Vue 3 SPA + Vue Router + ECharts）│
│  - /#/ 首页/爬取/管理/Top10/图谱/走势    │
│  - 服务端 store.js → fetch /api           │
└──────────────────┬───────────────────────┘
                   │ HTTP / fetch
┌──────────────────▼───────────────────────┐
│ Express 4（server/index.js，单端口 :3000） │
│  - 静态服务 dist/                          │
│  - /api/papers /api/search /api/crawl     │
│  - /api/top /api/graph /api/trend          │
│  - /api/share                              │
└──────────────────┬───────────────────────┘
                   │ better-sqlite3（实际用 node:sqlite）
┌──────────────────▼───────────────────────┐
│  server/data.db (papers / shares 两表)    │
└──────────────────────────────────────────┘
```

### 6.2 功能结构图

```
                ┌──────────────────────────────────┐
                │           客户端 SPA             │
                └──────────────────────────────────┘
            ┌─────────┬──────────┬─────────┬──────┴───────┐
            ▼         ▼          ▼         ▼              ▼
        ┌──────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
        │ 单篇 │ │ 批量   │ │ 管理   │ │ Top10  │ │ 热度走势 │
        │ 输入 │ │ 导入   │ │ CRUD   │ │ 图谱   │ │ 动图     │
        └──┬───┘ └───┬────┘ └───┬────┘ └───┬────┘ └────┬─────┘
           │         │                │         │             │
           ▼         ▼                ▼         ▼             ▼
        ┌─────────────────────────────────────────────────────┐
        │                /api/* (Express Router)               │
        │  crawl · search · papers · top · graph · trend · share│
        └────────────────────────┬────────────────────────────┘
                                 │
                ┌────────────────┼─────────────────┐
                ▼                ▼                 ▼
            ┌──────┐        ┌────────┐       ┌──────────┐
            │爬虫  │        │ SQLite │       │关键词/共 │
            │DBLP  │        │ papers │       │现/统计  │
            │兜底  │        │ shares │       │(分词/TF) │
            └──────┘        └────────┘       └──────────┘
```

### 6.3 数据流（以「论文爬取 + 模糊查询未命中自动爬取」为例）

1. 用户在 `/crawl` 输入「Segment Anything」+ DOI 「10.1109/CVPR...」，点提交
3. 前端调 `/api/search?q=Segment+Anything&...`
4. 后端精确匹配 → 命中 → 返回
5. 模糊匹配 → 命中 → 返回（mode=`fuzzy`）
6. 都未命中 → 调 `crawlPaperByTitle` → 命中本地 seed（`source: local-seed`）
7. 未命中本地 → 调 `fetchFromDBLP` 拿真实元数据（`source: dblp`）
8. DBLP 失败 → 合成兜底（`source: synthesized`，含伪 DOI）
9. 把爬到的 paper 预览给用户 → 用户点「入库」→ `POST /api/papers`
10. 后端校验 DOI → 写入 SQLite

---

## 7. 代码说明（关键模块解读）

> 完整 300+ 行关键代码见 `src/` 与 `server/` 目录，下面挑 4 段最关键的设计讲一下思路。

### 7.1 后端 DB 层（`server/db.js`）

**设计要点**
1. 用 Node 22.5+ 内置的 `node:sqlite`（同步 API，无需 await），避免 better-sqlite3 在 macOS Node24 上预编译二进制的 `libc++.1.dylib` 缺失问题。
2. 启动时检测 `pragma_table_info` 决定是否 `ALTER TABLE ADD COLUMN doi` —— 老库平滑迁移。
3. 所有 SQL 走 prepared statements，杜绝注入。
4. `rowToPaper` 把 authors/keywords 这两个 JSON 列解出来再返回前端，避免前端再 decode。

```javascript
// server/db.js（节选）
export const db = new DatabaseSync(dbPath)
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS papers (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, venue TEXT NOT NULL,
    year INTEGER NOT NULL, doi TEXT NOT NULL DEFAULT '',
    authors TEXT, abstract TEXT, keywords TEXT, url TEXT,
    created_at INTEGER DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000)
  );
  CREATE INDEX IF NOT EXISTS idx_papers_doi ON papers(doi);
`)

// 兼容老库
const hasDoi = db.prepare(
  "SELECT 1 AS x FROM pragma_table_info('papers') WHERE name='doi'"
).get()
if (!hasDoi) db.exec("ALTER TABLE papers ADD COLUMN doi TEXT NOT NULL DEFAULT '';")

export const papersRepo = {
  findByDOI(doi) {
    return rowToPaper(
      db.prepare('SELECT * FROM papers WHERE doi = ? LIMIT 1').get(doi.trim())
    )
  },
  fuzzySearch(q, { venue, year } = {}) {
    let sql = `SELECT * FROM papers
       WHERE (title LIKE ? OR keywords LIKE ? OR authors LIKE ?
              OR abstract LIKE ? OR doi LIKE ?)`
    const params = [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    if (venue && venue !== 'ALL') { sql += ' AND venue = ?'; params.push(venue) }
    if (year) { sql += ' AND year = ?'; params.push(Number(year)) }
    sql += ' ORDER BY year DESC, title ASC LIMIT 50'
    return db.prepare(sql).all(...params).map(rowToPaper)
  }
  // ...
}
```

### 7.2 关键词抽取 + TopN（`server/keywords.js`）

**设计要点**
- 分词：英文按非字母数字拆分；中文按 2~3 字 ngram。
- 停用词：英文通用停用词 + CV 领域弱信号词（"image / model / method"）。
- 频次：作者标注 > 自动抽取；TopN 默认按 count 降序。
- 共现：同一篇论文中两个关键词共同出现 → 图谱边权重。

```javascript
// server/keywords.js（节选）
export function topKeywords(papers, { topN = 10, byVenue } = {}) {
  const freq = new Map(), byKw = new Map()
  for (const p of papers) {
    const kws = p.keywords?.length
      ? p.keywords
      : extractKeywords(`${p.title}. ${p.abstract || ''}`, 8)
    for (const kw of kws) {
      const k = kw.toLowerCase()
      freq.set(k, (freq.get(k) || 0) + 1)
      if (!byKw.has(k)) byKw.set(k, {})
      byKw.get(k)[p.venue] = (byKw.get(k)[p.venue] || 0) + 1
    }
  }
  let arr = [...freq.entries()]
    .map(([k, v]) => ({ keyword: k, count: v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
  if (byVenue) arr = arr.map((r) => ({ ...r, byVenue: byKw.get(r.keyword) || {} }))
  return arr
}

export function keywordGraph(papers, { topN = 25, minCo = 2 } = {}) {
  const top = topKeywords(papers, { topN }).map((t) => t.keyword)
  const topSet = new Set(top)
  const coOccur = new Map()
  for (const p of papers) {
    const kws = (p.keywords || []).map((k) => k.toLowerCase()).filter((k) => topSet.has(k))
    if (kws.length === 0) {
      const ex = extractKeywords(`${p.title}. ${p.abstract || ''}`, 8)
        .filter((k) => topSet.has(k))
      ex.forEach((k) => kws.push(k))
    }
    const uniq = [...new Set(kws)]
    for (let i = 0; i < uniq.length; i++) {
      for (let j = i + 1; j < uniq.length; j++) {
        const key = uniq[i] < uniq[j] ? `${uniq[i]}||${uniq[j]}` : `${uniq[j]}||${uniq[i]}`
        coOccur.set(key, (coOccur.get(key) || 0) + 1)
      }
    }
  }
  // 构造 nodes / links 数组给 ECharts 用
  // ...
}
```

### 7.3 动图播放器（`src/views/Trend.vue`）

**设计要点**
- 不用 GIF 后端生成（重），改用前端 ECharts 动画 + `frameIndex` 控制。
- 每次 `frameIndex++`，图表 series 的 data 截到当前年份 —— ECharts 自动 0.4s 缓动补间，看起来像「绘制中」。
- 帧录制：用 `canvas.toDataURL()` 抓每帧 PNG，提示用 ffmpeg 合成 GIF（README 也写了命令）。

```javascript
// 动图模式：只画到当前 frameIndex 的年份
const dynamicOption = computed(() => {
  const curYear = data.value.years[frameIndex.value] ?? data.value.years[0]
  const series = data.value.series.map((s) => ({
    name: s.name, type: 'line', smooth: true,
    data: s.data.filter(([y]) => y <= curYear),
    animationDuration: 400
  }))
  return {
    backgroundColor: 'transparent',
    title: { text: `截至 ${curYear} 年`, left: 'center', textStyle: { color: '#cbd5e1' } },
    tooltip: { trigger: 'axis' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: '#cbd5e1' } },
    grid: { left: 40, right: 24, top: 40, bottom: 60 },
    xAxis: {
      type: 'value', name: '年',
      min: Math.min(...data.value.years), max: Math.max(...data.value.years),
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
    },
    yAxis: { type: 'value', name: '热度', axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
    series
  }
})
```

### 7.4 分享链接 + DOI 校验（`server/index.js` + 前端 Crawl.vue）

```javascript
// server/index.js（节选）
// POST /api/papers 强制 DOI
app.post('/api/papers', (req, res) => {
  const paper = req.body
  if (!paper?.title || !paper?.venue || !paper?.year)
    return res.status(400).json(fail('title/venue/year required'))
  if (!paper?.doi || !paper.doi.trim())
    return res.status(400).json(fail('doi required'))
  if (!paper.id)
    paper.id = `${paper.venue.toLowerCase()}${paper.year}-${slug(paper.doi)}`
  res.json(ok(papersRepo.upsert(paper)))
})

// 分享链接 → 短 id
app.post('/api/share', (req, res) => {
  const payload = req.body || {}
  if (Object.keys(payload).length === 0)
    return res.status(400).json(fail('empty payload'))
  const id = sharesRepo.create(payload)
  res.json(ok({ id, url: `${req.protocol}://${req.get('host')}/#/share/${id}` }))
})
```

```vue
<!-- src/views/Crawl.vue（节选）-->
<script setup>
function validateDoi(v) {
  const s = (v || '').trim()
  if (!s) return 'DOI 必填'
  if (!/^10\.\d{4,9}\/\S+$/i.test(s))
    return 'DOI 格式应为 10.xxxx/yyyy（如 10.1109/CVPR52729.2024.00041）'
  return ''
}
async function crawlSingle() {
  doiError.value = validateDoi(singleDoi.value)
  if (doiError.value) return
  // ... 调用 /api/search
}
</script>
<template>
  <label class="field-label required">
    DOI <span class="required-mark">*必填</span>
  </label>
  <input
    v-model="singleDoi"
    :class="{ 'input-error': doiError }"
    placeholder="10.1109/CVPR52729.2024.00041"
    @input="doiError = validateDoi(singleDoi)"
  />
  <p v-if="doiError" class="error-text">{{ doiError }}</p>
</template>
```

---

## 8. 成品展示（≥ 10 张图）

> 以下截图请在你的部署链接上自取。所有路径都基于 `npm start` 起的 `:3000` 服务。

1. **首页 hero + 统计卡**（`/`）—— 「CV 三会论文趋势分析」标题 + 4 个统计卡 + 6 张能力卡
2. **首页各会议论文占比 + 年度分布** —— 饼图 + 柱图
3. **论文爬取页 - 空态**（`/crawl`）—— 单篇输入与批量导入双栏
4. **论文爬取页 - DOI 校验失败** —— 输入 `bad-doi-format` 时红框 + 错误提示
5. **论文爬取页 - 爬取结果预览** —— 命中本地 seed，带 `local-seed` 标签 + DOI
6. **论文管理页 - 列表 + DOI badge**（`/manage`）—— 卡片头部紫色 DOI badge 可点直达
7. **论文详情页 - DOI 直跳**（`/paper/cvpr2024-sam`）—— 独立 DOI 段落 + 元数据表
8. **Top10 - 横条排行 + 三会雷达**（`/top10`）
9. **Top10 - 年度热词演变折线**（附加功能 1）
10. **关键词图谱**（`/graph`）—— 力导向图，点击节点右侧下钻
11. **热度走势动图播放**（`/trend`）—— 按播放按钮，逐年累加
12. **热度走势 - 帧录制导出** —— PNG 序列 + ffmpeg 命令提示
13. **了解更多页**（`/about`）—— CV 三会介绍 + 统计口径
14. **分享链接** —— `/manage` 点「生成分享链接」→ 复制 URL → 新浏览器打开 → 自动恢复搜索

> 录制动图建议：用 macOS 自带的 `Cmd+Shift+5` 或 OBS 录 10 秒 GIF，插入博客即可。

---

## 9. AI 结对协作记录

### 协作原则

- **我先想 → AI 起草 → 我改**（拒绝盲抄）
- **每个采纳点都能解释为什么**（拒绝黑箱）
- 关键模块（DB schema、关键词算法、动图播放器、DOI 校验）我都能逐行解释

### 案例 A：需求分析与原型设计（头脑风暴）

**Prompt 1**（信息架构）：
```
我需要做一个 CV 三会论文趋势分析平台，包含论文爬取、列表管理、Top10、
关键词图谱、热度走势动图 5 个基础功能 + 2 个附加功能。请帮我从用户视角
列出每个页面的信息架构（IA）和关键交互。要求：
1. 每个页面列出核心区块、信息优先级
2. 页面之间的跳转关系
3. 容易踩坑的地方（特别是动图播放和图谱下钻）
```

**AI 输出摘要**：
> 给出 8 个页面的 IA 草图。建议首页 hero 放 4 个统计卡 + 6 张能力卡，Top10 同时给柱图和雷达对比，关键词图谱默认 `topN=25, minCo=2`。

**我的修改 / 理由**：
- ✅ 采纳：8 页面 IA、能力卡设计
- ✏️ 改：Top10 的「附加功能 1 年度热词演变」我让它内嵌在 `/top10` 页面下半部分，而不是单独一个路由 —— 用户调研后认为读者更愿意在「看 Top10」时顺带看趋势，减少跳转。
- ✏️ 改：关键词图谱默认 `topN=25` 太密，改为可下拉选 15/25/40，`minCo=1/2/3` 调节边密度。
- ❌ 拒绝：AI 建议的「首页放搜索框」—— 让搜索留在 `/crawl` 和 `/manage` 更聚焦。

**Prompt 2**（UI 配色）：
```
平台定位是学术工具，受众是 CV 研究者。配色想表达「严肃 + 现代」+ 暗色护眼。
给我 3 套配色方案 + 各自适合的风格描述。
```

**AI 输出**：
> A 蓝紫渐变 / B 暗红橙 / C 单色灰。AI 推 A，因为和 ECharts 默认调色更搭。

**我的选择**：A（蓝紫渐变 #5b8def → #7c3aed），最终成项目主色。

### 案例 B：编码实现关键词图谱

**Prompt 3**：
```
帮我写 ECharts 力导向图的 option。
需求：
- 节点 = Top 25 关键词，边 = 共现次数（minCo=2）
- 节点大小映射 log2(freq+1) * 8 + 8（最小 10，最大 40）
- 点击节点 → 在右侧下钻面板列出相关论文
- 配色用紫/蓝
```

**AI 输出**（摘要）：
```javascript
const option = computed(() => ({
  series: [{
    type: 'graph', layout: 'force',
    data: nodes.map((n) => ({
      symbolSize: Math.max(10, Math.min(40, 8 + Math.log2(n.value + 1) * 8)),
      ...
    })),
    force: { repulsion: 220, edgeLength: 80, gravity: 0.05 },
    emphasis: { focus: 'adjacency', lineStyle: { width: 4 } }
  }]
}))
```

**我的修改**：
- ✏️ AI 漏了 `lineStyle.color: 'rgba(91,141,239,0.4)'`，加上了，否则默认黑线在暗色背景下看不清。
- ✏️ AI 把 `focus: 'adjacency'` 放在 `emphasis` 里对，但没设 `label.fontWeight`，加上了让 hover 时标签加粗。
- ✏️ `draggable: true` AI 没加，我加上 —— 节点拖拽是图谱分析的刚需。

**理由**：这是关键的人机分工 —— AI 写出核心 option，我 review 后补足交互细节和样式适配。

### 案例 C：调试与修复 Bug（SQLite 选型）

**Prompt 4**：
```
项目用 better-sqlite3 持久化。在 Node 24 (v24.0.0+) 上启动失败，错误：
Error: dlopen(...better_sqlite3.node): Library not loaded: @rpath/libc++.1.dylib
本地 macOS + Node 24.21.0。npm rebuild 也无效。怎么办？
```

**AI 输出摘要**：
> 三种思路：
> 1. 用 `npm rebuild better-sqlite3 --build-from-source` —— 但需要 Xcode CLT；
> 2. 改用 `sql.js`（WASM）—— 纯 JS，但数据在内存；
> 3. 用 Node 22.5+ 内置的 `node:sqlite`（实验性）—— 零原生依赖，跨平台一致。

**我的判断 / 修改**：
- ✏️ 试了方案 1：`npm rebuild --build-from-source` 输出 "rebuilt successfully"，但实际并没真编，还是同一份预编译。放弃。
- ✅ 采纳方案 3：`node:sqlite` 在 Node 24 已稳定，无需 flag，API 与 better-sqlite3 几乎一致（同步 prepared statements、`.run / .get / .all`）。重写 `server/db.js`：
  - `import { DatabaseSync } from 'node:sqlite'`
  - 命名参数 `@name` 改成位置参数 `?`（node:sqlite 不支持命名）
  - 其它代码几乎原样搬迁

**结果**：本地 + 部署都通，无任何原生编译。`engines.node: ">=22.5.0"` 已写入 `package.json` 提示部署侧。

> 这是一个「AI 提供选项，我做选型 + 实施」的典型案例。AI 给的 3 个方案都对，但只有 3 同时满足「零依赖 / 跨平台 / API 兼容」三条，我判断对的过程是把方案 1 试穿再放弃。

### 案例 D：额外的代码审查（DOI 字段）

**Prompt 5**：
```
我要给论文加一个 DOI 字段，必填。前后端都要改。请列出需要改的文件 + 每处的关键改动。
```

**AI 输出**：列出 5 个文件清单（Crawl.vue / Manage.vue / PaperCard.vue / PaperDetail.vue / server/db.js）。

**我额外补的**：
- `server/db.js` 加老库 `ALTER TABLE ADD COLUMN` 的兼容路径（AI 漏了，导致现有库会启动失败）
- `server/index.js` 加 `findByDOI` + `looksLikeDOI` 工具函数，让 DOI 查询走精确匹配而非模糊
- `server/crawler.js` 让 DBLP 路径优先取 `info.doi`，合成路径生成伪 DOI（避免兜底后入库失败）

**理由**：必填字段的全链路修改容易出"半截子 bug" —— 后端漏兼容老库会启动崩溃，前端漏管理页会让已入库的论文改不了 DOI。我把 AI 给的清单做了一次「端到端遍历」，找出 3 处遗漏。

---

## 10. 心路历程与对 AI 结对伙伴的评价

### 心路历程

最初接到作业时我对「人机结对」是半信半疑的 —— 既想体验最新 AI 协作开发，又担心「AI 写出来我看不懂」或「代码质量不可控」。实际做下来，几个关键转折点：

1. **从「让 AI 写」到「让 AI 起草」**：第一轮我把整个项目甩给 AI，结果发现它一次性给出的方案要么过于复杂（用 Pinia + Vuex + Redux 三件套），要么过度工程化（webpack 配置写了 200 行）。我迅速收敛到「先给我一个最小可跑的脚手架，细节我自己补」的工作模式。

2. **算法调优要靠领域知识**：关键词抽取的停用词、TopN 排序的「热度 = 词频 × 年增长率」、共现图的 `minCo` 阈值——AI 能写出函数，但阈值参数它不知道该取多少。这部分必须人工拍板，AI 在 prompt 里提供默认值供参考。

3. **踩坑最有价值**：SQLite 选型那个坑（better-sqlite3 → node:sqlite）原本是可以"绕过去"的——直接换更老的 Node 版本。但我选择"今天踩了今天修"，因为这个坑暴露了「依赖二进制兼容性」的可移植性问题，比悄悄绕过去更能让我学到东西。AI 提供的 3 个选项也直接帮了我。

4. **动图播放器的设计最体现"协作"**：AI 给的初版是 GIF 后端生成方案（重、慢、不实时），我换成前端 ECharts 帧动画 + frameIndex 控制。这个方案是 AI 没主动提的，但它给的相关代码（setInterval + canvas.toDataURL）帮我节省了 30 分钟。

### 对 AI 结对伙伴（Mavis）的评价

**优势**：
- ✅ **覆盖面广**：从 NABCD 头脑风暴到 SQLite 选型到 ECharts 配置，能跨多个领域给建议
- ✅ **多选项对比**：给方案时通常 2~3 个备选 + 各自优劣，比单纯给一个答案更让人能判断
- ✅ **代码片段可直接 copy**：语法、命名、边界条件都相对扎实，省去查文档时间
- ✅ **文档撰写**：README、博客、commit message 写得相当可读，省下大量文字工作

**局限**：
- ⚠️ **领域知识依赖**：CV 三会的统计口径、CiteSpace 的输出格式、停用词表等，需要人类先有概念，AI 才能填充代码
- ⚠️ **过度生成倾向**：AI 会写出「应该需要的」逻辑，但其实当前不需要 —— 我必须自己裁剪
- ⚠️ **没法跑代码验证**：它给的方案不一定真能跑，必须自己 npm install + build + 启动验证
- ⚠️ **盲采的安全隐患**：如果不过 review 直接 commit，半年后看就是「这段代码谁写的？」—— 我坚持 review 后才采纳，避免半年后自己看不懂

**改进建议（对未来的 AI 结对）**：
- 在「需求理解」阶段，AI 应主动询问「当前用户最痛的点」而非一次给完整方案；
- 在「编码」阶段，遇到选型问题（如本作业的 DB 库），AI 应主动列出「每个方案的兼容性 / 维护性 / 学习成本」三维评分，而非只列优缺点。

**一句话总结**：
> AI 是「高质量的初级工程师」，能帮你写 80% 的代码，但剩下的 20%（选型、领域知识、可读性、踩坑）必须由人来做决定。这次作业让我更确信：**人机协作不是替代，而是杠杆** —— 杠杆放在「AI 起草 + 人 review」这个支点上，效率最高。

---

> **附：交付物清单**
> - ✅ CodeArts 仓库（main + dev 分支，v1.0.0 tag）
> - ✅ README.md + codestyle.md
> - ✅ 5 + 2 功能完整实现
> - ✅ 部署到华为云 ECS（Node 24 + 单端口 :3000）
> - ✅ 19+ 个语义化 commit + dev 分支合并
> - ✅ 博客（含 PSP / NABCD / 3 个代表性案例 / 300 行关键代码解读）