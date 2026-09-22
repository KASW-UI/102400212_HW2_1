/**
 * 前端 API 调用层。
 * 所有读 / 写都走后端；本地仅缓存一份副本用于离线 UI。
 */
const BASE = '/api'

async function http(method, url, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + url, opts)
  let json
  try {
    json = await res.json()
  } catch {
    throw new Error(`HTTP ${res.status}: 返回非 JSON`)
  }
  if (!res.ok || !json.ok) {
    throw new Error(json.error || `HTTP ${res.status}`)
  }
  return json.data
}

export const api = {
  health: () => http('GET', '/health'),
  stats: () => http('GET', '/stats'),

  papers: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString()
      return http('GET', `/papers${qs ? '?' + qs : ''}`)
    },
    get: (id) => http('GET', `/papers/${id}`),
    create: (paper) => http('POST', '/papers', paper),
    update: (id, paper) => http('PUT', `/papers/${id}`, paper),
    remove: (id) => http('DELETE', `/papers/${id}`)
  },

  search: ({ q, venue, year, crawl = true }) => {
    const params = new URLSearchParams({ q })
    if (venue && venue !== 'ALL') params.set('venue', venue)
    if (year) params.set('year', String(year))
    params.set('crawl', crawl ? '1' : '0')
    return http('GET', `/search?${params.toString()}`)
  },

  crawl: (titles) => http('POST', '/crawl', { titles }),

  top: ({ topN = 10, venue = 'ALL' } = {}) => {
    const qs = new URLSearchParams({ topN: String(topN), venue }).toString()
    return http('GET', `/top?${qs}`)
  },

  graph: ({ topN = 25, minCo = 2, venue = 'ALL' } = {}) => {
    const qs = new URLSearchParams({
      topN: String(topN),
      minCo: String(minCo),
      venue
    }).toString()
    return http('GET', `/graph?${qs}`)
  },

  trend: ({ topN = 6 } = {}) => {
    const qs = new URLSearchParams({ topN: String(topN) }).toString()
    return http('GET', `/trend?${qs}`)
  },

  share: {
    create: (payload) => http('POST', '/share', payload),
    get: (id) => http('GET', `/share/${id}`)
  }
}