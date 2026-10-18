/**
 * 关键词抽取与统计工具（后端 + 前端共用思路）
 *
 * - 分词：英文按非字母数字拆分；中文按字符 n-gram (bi/tri)。
 * - 停用词：内置常见英文停用词 + CV 领域弱信号词。
 * - 统计口径：词频 (frequency) 与热度 (frequency × (1 + year_growth))
 *   其中 year_growth = (本年频次 - 上一年频次) / max(1, 上一年频次)。
 */

// 英文停用词（精简版，覆盖 NLP 文献常见停用词）
export const STOP_WORDS = new Set(
  `a,about,above,after,again,against,all,am,an,and,any,are,aren,as,at,be,because,been,
before,being,below,between,both,but,by,could,couldn,did,didn,do,does,doesn,doing,don,
down,during,each,few,for,further,had,hadn,has,hasn,have,haven,having,he,her,here,hers,
herself,him,himself,his,how,i,if,in,into,is,isn,it,its,itself,just,ll,let,me,more,most,
mustn,my,myself,no,nor,not,now,of,off,on,once,only,or,other,our,ours,ourselves,out,
over,own,re,s,shan,she,should,shouldn,so,some,such,t,than,that,the,their,theirs,them,
themselves,then,there,these,they,this,those,through,to,too,under,until,up,ve,very,was,
wasn,were,weren,what,when,where,which,while,who,whom,why,will,with,won,would,wouldn,
you,your,yours,yourself,yourselves,also,use,used,using,via,well,may,many,often,new,
based,approach,paper,propose,proposed,method,methods,results,show,shown,achieves,
achieving,evaluate,evaluation,compared,comparison,existing,recent,state,art,model,
models,framework,technique,techniques,problem,task,datasets,set,train,test,image,
images,video,feature,features,work,works,large,scale,sota`
    .split(',')
    .map((s) => s.trim())
)

// CV 领域弱信号 / 通用术语（避免刷屏）
export const DOMAIN_STOP = new Set([
  'image',
  'images',
  'video',
  'feature',
  'features',
  'method',
  'methods',
  'approach',
  'approaches',
  'result',
  'results',
  'task',
  'tasks',
  'model',
  'models',
  'framework',
  'frameworks',
  'paper',
  'work',
  'works',
  'propose',
  'proposed',
  'show',
  'shown',
  'achieve',
  'achieves',
  'state-of-the-art',
  'sota',
  'performance',
  'novel',
  'effective',
  'efficient',
  'accurate'
])

const TOKEN_RE = /[a-z][a-z0-9-]{1,}|\d+|[一-鿿]{2,3}/g

/**
 * 从文本提取 token 数组（小写英文 + 2~3 字中文 ngram）。
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  if (!text) return []
  const lower = text.toLowerCase()
  const raw = lower.match(TOKEN_RE) || []
  return raw.filter((w) => {
    if (w.length < 2) return false
    if (STOP_WORDS.has(w)) return false
    if (DOMAIN_STOP.has(w)) return false
    if (/^\d+$/.test(w)) return false
    return true
  })
}

/**
 * 计算所有论文的 Top N 关键词
 * @param {Array} papers 论文数组
 * @param {Object} opts   { topN, byVenue, byKeyword }
 */
export function topKeywords(papers, opts = {}) {
  const { topN = 10, byVenue = null } = opts
  const freq = new Map()
  const byKw = new Map() // kw -> {venue: count}

  for (const p of papers) {
    const kws = p.keywords?.length
      ? p.keywords
      : extractKeywords(`${p.title}. ${p.abstract || ''}`, 8)
    for (const kw of kws) {
      const k = kw.toLowerCase()
      freq.set(k, (freq.get(k) || 0) + 1)
      if (!byKw.has(k)) byKw.set(k, {})
      const vmap = byKw.get(k)
      vmap[p.venue] = (vmap[p.venue] || 0) + 1
    }
  }

  let arr = [...freq.entries()]
    .map(([k, v]) => ({ keyword: k, count: v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)

  if (byVenue) {
    arr = arr.map((row) => ({ ...row, byVenue: byKw.get(row.keyword) || {} }))
  }
  return arr
}

/**
 * 从一段文本中抽取 Top N 关键词（频次 + 词长度权重）
 * @param {string} text
 * @param {number} topN
 */
export function extractKeywords(text, topN = 8) {
  const tokens = tokenize(text)
  const freq = new Map()
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1)
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([k]) => k)
}

/**
 * 跨年份按 关键词 计算热度走势
 * @param {Array} papers
 * @returns {{keywords: string[], years: number[], series: Array}}
 */
export function trendByYear(papers, { topN = 8, venues = ['CVPR', 'ICCV', 'ECCV'] } = {}) {
  // 先拿到 Top 词
  const top = topKeywords(papers, { topN: topN * 2 }).slice(0, topN)
  const keywords = top.map((t) => t.keyword)
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => a - b)

  const series = []
  for (const kw of keywords) {
    for (const venue of venues) {
      const data = years.map((y) => {
        const n = papers.filter(
          (p) =>
            p.year === y &&
            p.venue === venue &&
            (p.keywords?.some((k) => k.toLowerCase() === kw) ||
              extractKeywords(`${p.title}. ${p.abstract || ''}`).includes(kw))
        ).length
        return [y, n]
      })
      series.push({ name: `${kw} · ${venue}`, keyword: kw, venue, data })
    }
  }
  return { keywords, years, series }
}

/**
 * 计算 Top N 关键词的共现图（节点 + 边）
 * @param {Array} papers
 */
export function keywordGraph(papers, { topN = 25, minCo = 2 } = {}) {
  const top = topKeywords(papers, { topN }).map((t) => t.keyword)
  const topSet = new Set(top)
  // 统计共现
  const coOccur = new Map() // key: 'a||b' -> count
  for (const p of papers) {
    const kws = (p.keywords || []).map((k) => k.toLowerCase()).filter((k) => topSet.has(k))
    if (kws.length === 0) {
      // 用抽取结果作为兜底
      const ex = extractKeywords(`${p.title}. ${p.abstract || ''}`, 8).filter((k) =>
        topSet.has(k)
      )
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
  // 出节点
  const freqMap = new Map()
  for (const p of papers) {
    const kws = (p.keywords || []).map((k) => k.toLowerCase())
    for (const k of kws) {
      if (topSet.has(k)) freqMap.set(k, (freqMap.get(k) || 0) + 1)
    }
  }
  const nodes = top.map((k) => ({
    id: k,
    name: k,
    value: freqMap.get(k) || 0,
    category: 0
  }))
  const links = []
  for (const [key, count] of coOccur.entries()) {
    if (count < minCo) continue
    const [a, b] = key.split('||')
    links.push({ source: a, target: b, value: count })
  }
  return { nodes, links }
}