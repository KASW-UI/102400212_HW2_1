/**
 * 嵌入式 SQLite 持久化层。
 *
 * 采用 Node 内置的 `node:sqlite`（Node 22.5+ 实验性；Node 24 默认稳定）。
 * 优点：无需原生编译，跨平台一致。
 * 部署要求：Node ≥ 22.5（推荐 24 LTS）。
 *
 * 表结构：
 *   papers     论文主表
 *   shares     分享链接状态
 */
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.db')

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new DatabaseSync(dbPath)
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS papers (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    venue       TEXT NOT NULL,
    year        INTEGER NOT NULL,
    doi         TEXT NOT NULL DEFAULT '',
    authors     TEXT,
    abstract    TEXT,
    keywords    TEXT,
    url         TEXT,
    created_at  INTEGER DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000)
  );
  CREATE INDEX IF NOT EXISTS idx_papers_year  ON papers(year);
  CREATE INDEX IF NOT EXISTS idx_papers_venue ON papers(venue);
  CREATE INDEX IF NOT EXISTS idx_papers_doi   ON papers(doi);
`)

// 兼容已有库：给 papers 加 doi 列（若缺失）
const hasDoi = db
  .prepare("SELECT 1 AS x FROM pragma_table_info('papers') WHERE name='doi'")
  .get()
if (!hasDoi) {
  db.exec("ALTER TABLE papers ADD COLUMN doi TEXT NOT NULL DEFAULT '';")
  db.exec('CREATE INDEX IF NOT EXISTS idx_papers_doi ON papers(doi);')
}

db.exec(`
  CREATE TABLE IF NOT EXISTS shares (
    id          TEXT PRIMARY KEY,
    payload     TEXT NOT NULL,
    created_at  INTEGER DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000)
  );
`)

// ---------- helpers ----------
// node:sqlite 的结果对象是 null prototype，这里统一标准化。
const plain = (r) => (r ? Object.assign({}, r) : r)

function rowToPaper(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    year: row.year,
    doi: row.doi || '',
    authors: safeJson(row.authors, []),
    abstract: row.abstract || '',
    keywords: safeJson(row.keywords, []),
    url: row.url || ''
  }
}

function safeJson(s, fallback) {
  try {
    return JSON.parse(s)
  } catch {
    return fallback
  }
}

// ---------- papers CRUD ----------
export const papersRepo = {
  list({ venue, year, q } = {}) {
    let sql = 'SELECT * FROM papers WHERE 1=1'
    const params = []
    if (venue && venue !== 'ALL') {
      sql += ' AND venue = ?'
      params.push(venue)
    }
    if (year) {
      sql += ' AND year = ?'
      params.push(Number(year))
    }
    if (q) {
      sql += ' AND (title LIKE ? OR keywords LIKE ? OR abstract LIKE ? OR authors LIKE ? OR doi LIKE ?)'
      const qq = `%${q}%`
      params.push(qq, qq, qq, qq, qq)
    }
    sql += ' ORDER BY year DESC, venue ASC, title ASC'
    return db.prepare(sql).all(...params).map(rowToPaper)
  },

  get(id) {
    return rowToPaper(db.prepare('SELECT * FROM papers WHERE id = ?').get(id))
  },

  findByTitle(title) {
    return rowToPaper(
      db.prepare('SELECT * FROM papers WHERE lower(title) = lower(?) LIMIT 1').get(title.trim())
    )
  },

  findByDOI(doi) {
    return rowToPaper(
      db.prepare('SELECT * FROM papers WHERE doi = ? LIMIT 1').get(doi.trim())
    )
  },

  fuzzySearch(q, { venue, year } = {}) {
    if (!q) return []
    let sql = `
      SELECT * FROM papers
       WHERE (title LIKE ? OR keywords LIKE ? OR authors LIKE ? OR abstract LIKE ? OR doi LIKE ?)
      `
    const params = [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    if (venue && venue !== 'ALL') {
      sql += ' AND venue = ?'
      params.push(venue)
    }
    if (year) {
      sql += ' AND year = ?'
      params.push(Number(year))
    }
    sql += ' ORDER BY year DESC, title ASC LIMIT 50'
    return db.prepare(sql).all(...params).map(rowToPaper)
  },

  upsert(paper) {
    db.prepare(
      `INSERT INTO papers (id, title, venue, year, doi, authors, abstract, keywords, url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         venue = excluded.venue,
         year = excluded.year,
         doi = excluded.doi,
         authors = excluded.authors,
         abstract = excluded.abstract,
         keywords = excluded.keywords,
         url = excluded.url`
    ).run(
      paper.id,
      paper.title,
      paper.venue,
      paper.year,
      paper.doi || '',
      JSON.stringify(paper.authors || []),
      paper.abstract || '',
      JSON.stringify(paper.keywords || []),
      paper.url || ''
    )
    return this.get(paper.id)
  },

  remove(id) {
    const r = db.prepare('DELETE FROM papers WHERE id = ?').run(id)
    return r.changes > 0
  },

  count() {
    const row = db.prepare('SELECT COUNT(*) AS n FROM papers').get()
    return row?.n || 0
  },

  stats() {
    const total = this.count()
    const byVenue = db
      .prepare('SELECT venue, COUNT(*) AS n FROM papers GROUP BY venue ORDER BY n DESC')
      .all()
      .map(plain)
    const byYear = db
      .prepare('SELECT year, COUNT(*) AS n FROM papers GROUP BY year ORDER BY year ASC')
      .all()
      .map(plain)
    return { total, byVenue, byYear }
  }
}

// ---------- shares ----------
export const sharesRepo = {
  create(payload) {
    const id = Math.random().toString(36).slice(2, 10)
    db.prepare('INSERT INTO shares (id, payload) VALUES (?, ?)').run(id, JSON.stringify(payload))
    return id
  },
  get(id) {
    const row = db.prepare('SELECT payload FROM shares WHERE id = ?').get(id)
    return row ? JSON.parse(row.payload) : null
  }
}