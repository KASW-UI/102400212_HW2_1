<script setup>
/**
 * 论文列表管理（功能 2）。
 *
 *  - 列表：搜索（精确/模糊）、按会议/年份筛选、排序
 *  - 增改：模态编辑表单
 *  - 删：二次确认
 *  - 查询空 → 触发"联网爬取"按钮，自动写入
 */
import { ref, computed, onMounted } from 'vue'
import { usePapersStore } from '@/store/papers'
import { api } from '@/services/api'
import { useRoute } from 'vue-router'
import PaperCard from '@/components/PaperCard.vue'

const store = usePapersStore()
const route = useRoute()
onMounted(async () => {
  await store.load()
  // 从分享链接恢复时附带 q / venue / year
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
    if (route.query.venue) venue.value = String(route.query.venue)
    if (route.query.year) year.value = String(route.query.year)
    await doSearch()
  }
})

// 筛选状态
const searchQuery = ref('')
const venue = ref('ALL')
const year = ref('ALL')
const sortBy = ref('year-desc')

const editing = ref(null) // 编辑中的论文
const creating = ref(false) // 新建论文对话框
const showCrawlPrompt = ref(false)
const crawlStatus = ref(null)
const crawledPaper = ref(null)

// 列表结果（含搜索时使用 /api/search 命中）
const searchResult = ref(null) // { mode, matches, crawled }

const filtered = computed(() => {
  let arr = store.papers
  if (venue.value !== 'ALL') arr = arr.filter((p) => p.venue === venue.value)
  if (year.value !== 'ALL') arr = arr.filter((p) => String(p.year) === year.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    arr = arr.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.keywords || []).some((k) => k.toLowerCase().includes(q)) ||
        (p.authors || []).some((a) => a.toLowerCase().includes(q))
    )
  }
  // 排序
  const [k, dir] = sortBy.value.split('-')
  arr = [...arr].sort((a, b) => {
    const av = k === 'year' ? a.year : k === 'venue' ? a.venue : a.title
    const bv = k === 'year' ? b.year : k === 'venue' ? b.venue : b.title
    if (av < bv) return dir === 'asc' ? -1 : 1
    if (av > bv) return dir === 'asc' ? 1 : -1
    return 0
  })
  return arr
})

async function doSearch() {
  const q = searchQuery.value.trim()
  if (!q) {
    searchResult.value = null
    return
  }
  try {
    const res = await api.search({
      q,
      venue: venue.value,
      year: year.value !== 'ALL' ? Number(year.value) : undefined,
      crawl: true
    })
    searchResult.value = res
    if (res.mode === 'crawled' && res.crawled) {
      crawledPaper.value = res.crawled
      showCrawlPrompt.value = true
      crawlStatus.value = 'crawled'
    }
  } catch (e) {
    crawlStatus.value = 'error: ' + e.message
  }
}

async function importCrawled() {
  if (!crawledPaper.value) return
  await store.add(crawledPaper.value)
  showCrawlPrompt.value = false
  searchResult.value = null
}

function startCreate() {
  editing.value = {
    id: '',
    title: '',
    doi: '',
    venue: 'CVPR',
    year: 2024,
    authors: [],
    abstract: '',
    keywords: [],
    url: ''
  }
  creating.value = true
}

function startEdit(paper) {
  editing.value = JSON.parse(JSON.stringify(paper))
  creating.value = false
}

async function saveEdit() {
  if (!editing.value.title) return
  if (!editing.value.doi || !editing.value.doi.trim()) {
    alert('DOI 不能为空')
    return
  }
  if (!/^10\.\d{4,9}\/\S+$/i.test(editing.value.doi.trim())) {
    alert('DOI 格式不正确，应为 10.xxxx/yyyy')
    return
  }
  if (creating.value) {
    await store.add(editing.value)
  } else {
    await store.update(editing.value.id, editing.value)
  }
  editing.value = null
}

async function confirmDelete(paper) {
  if (!confirm(`确认删除「${paper.title}」？`)) return
  await store.remove(paper.id)
}

function shareQuery() {
  // GitHub Pages 部署下：分享链接只存在当前浏览器 localStorage
  // 因此 URL hash 会带 ?share=<id>，接收方在自己浏览器里能看到一致内容
  const payload = { q: searchQuery.value, venue: venue.value, year: year.value }
  api.share.create(payload).then((id) => {
    const url = `${location.origin}${location.pathname}#/share?id=${id}`
    navigator.clipboard?.writeText(url)
    alert(`分享链接已复制（仅在你本地浏览器可读）：\n${url}`)
  })
}
</script>

<template>
  <section>
    <header>
      <h1 class="h1">论文列表管理</h1>
      <p class="muted">增、删、改、查。查询不存在时联网爬取并可一键入库。</p>
      <p class="banner banner-info" style="margin-top:8px">
        <strong>演示数据模式</strong>：站点部署在 GitHub Pages（静态），仅支持浏览与本地分享。
        增 / 改 / 删 / 联网爬取已禁用。
      </p>
    </header>

    <!-- 筛选 / 搜索 -->
    <div class="glass card" style="margin-top:16px">
      <div class="filters">
        <div style="flex:2">
          <label class="field-label">搜索（标题 / 作者 / 关键词 / 摘要）</label>
          <input
            v-model="searchQuery"
            class="input"
            placeholder="例如：diffusion / SAM / 何恺明"
            @keyup.enter="doSearch"
          />
        </div>
        <div>
          <label class="field-label">会议</label>
          <select v-model="venue" class="select">
            <option value="ALL">全部</option>
            <option v-for="v in store.venues" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>
        <div>
          <label class="field-label">年份</label>
          <select v-model="year" class="select">
            <option value="ALL">全部</option>
            <option v-for="y in store.years" :key="y" :value="String(y)">{{ y }}</option>
          </select>
        </div>
        <div>
          <label class="field-label">排序</label>
          <select v-model="sortBy" class="select">
            <option value="year-desc">年份 ↓</option>
            <option value="year-asc">年份 ↑</option>
            <option value="venue-asc">会议 A-Z</option>
            <option value="title-asc">标题 A-Z</option>
          </select>
        </div>
      </div>
      <div class="filters-actions">
        <button class="btn btn-primary" @click="doSearch">查询（未命中自动爬取）</button>
        <button class="btn" @click="shareQuery" :disabled="!searchQuery">生成分享链接</button>
        <button class="btn btn-primary" disabled title="GitHub Pages 静态部署不支持写入">＋ 新增论文</button>
      </div>
    </div>

    <!-- 查询结果区 -->
    <div v-if="searchResult" class="glass card" style="margin-top:16px">
      <h2 class="section-title">查询结果</h2>
      <p class="section-sub">
        <span class="tag tag-blue">命中模式：{{ searchResult.mode }}</span>
        <span v-if="searchResult.crawled" class="tag tag-orange">已自动联网爬取</span>
      </p>
      <div v-if="searchResult.matches?.length" class="list">
        <PaperCard
          v-for="p in searchResult.matches"
          :key="p.id"
          :paper="p"
          compact
          readonly
          @edit="startEdit"
          @delete="confirmDelete"
        />
      </div>
      <div v-else-if="!searchResult.crawled" class="empty">
        未找到结果。请尝试更换关键词或更换会议/年份。
      </div>
    </div>

    <!-- 论文列表 -->
    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">论文库（{{ filtered.length }} / {{ store.papers.length }}）</h2>
      <p class="section-sub">当前筛选条件下展示的论文（本地已缓存）</p>
      <div v-if="filtered.length === 0" class="empty">当前筛选无数据</div>
      <div v-else class="grid-2">
        <PaperCard
          v-for="p in filtered"
          :key="p.id"
          :paper="p"
          compact
          readonly
          @edit="startEdit"
          @delete="confirmDelete"
        />
      </div>
    </div>

    <!-- 编辑 / 新建 -->
    <div v-if="editing" class="modal-mask" @click.self="editing = null">
      <div class="modal">
        <h2 class="h2">{{ creating ? '新增论文' : '编辑论文' }}</h2>
        <div class="form">
          <label class="field-label">标题</label>
          <input v-model="editing.title" class="input" />
          <label class="field-label required">
            DOI <span class="required-mark">*必填</span>
          </label>
          <input
            v-model="editing.doi"
            class="input"
            :class="{ 'input-error': editing.doi && !/^10\.\d{4,9}\/\S+$/i.test(editing.doi.trim()) }"
            placeholder="10.1109/CVPR52729.2024.00041"
          />
          <div class="form-row">
            <div style="flex:1">
              <label class="field-label">会议</label>
              <select v-model="editing.venue" class="select">
                <option>CVPR</option><option>ICCV</option><option>ECCV</option>
              </select>
            </div>
            <div style="width:120px">
              <label class="field-label">年份</label>
              <input v-model.number="editing.year" type="number" class="input" />
            </div>
          </div>
          <label class="field-label">作者（逗号分隔）</label>
          <input :value="(editing.authors || []).join(', ')" class="input" @input="(e) => editing.authors = e.target.value.split(',').map(s => s.trim()).filter(Boolean)" />
          <label class="field-label">关键词（逗号分隔）</label>
          <input :value="(editing.keywords || []).join(', ')" class="input" @input="(e) => editing.keywords = e.target.value.split(',').map(s => s.trim()).filter(Boolean)" />
          <label class="field-label">摘要</label>
          <textarea v-model="editing.abstract" class="textarea" />
          <label class="field-label">原文链接</label>
          <input v-model="editing.url" class="input" />
        </div>
        <div class="actions" style="margin-top:16px;justify-content:flex-end">
          <button class="btn" @click="editing = null">取消</button>
          <button class="btn btn-primary" @click="saveEdit">保存</button>
        </div>
      </div>
    </div>

    <!-- 自动爬取后询问入库 -->
    <div v-if="showCrawlPrompt" class="modal-mask" @click.self="showCrawlPrompt = false">
      <div class="modal">
        <h2 class="h2">未命中本地库，已自动联网爬取</h2>
        <p class="muted">是否把这条论文写入数据库？</p>
        <div v-if="crawledPaper" style="margin-top:12px">
          <PaperCard :paper="crawledPaper" compact />
        </div>
        <div class="actions" style="margin-top:16px;justify-content:flex-end">
          <button class="btn" @click="showCrawlPrompt = false">暂不</button>
          <button class="btn btn-primary" @click="importCrawled">入库</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
}
@media (max-width: 880px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
.filters-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form-row {
  display: flex;
  gap: 12px;
}
.actions {
  display: flex;
  gap: 8px;
}
.field-label.required .required-mark {
  margin-left: 6px;
  font-size: 10px;
  color: var(--c-danger);
  letter-spacing: 0;
  text-transform: none;
}
.input-error {
  border-color: var(--c-danger) !important;
  background: rgba(248, 113, 113, 0.08) !important;
}
</style>