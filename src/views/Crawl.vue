<script setup>
/**
 * 论文爬取 / 导入页（功能 1）。
 *
 * 交互：
 *  - 单个输入：标题 → 后端爬取 → 返回预览 → 确认入库
 *  - 批量导入：粘贴多行标题（每行一篇）或上传 .txt / .json
 *  - 在线预览 + 一键写入
 */
import { ref, computed } from 'vue'
import { usePapersStore } from '@/store/papers'
import PaperCard from '@/components/PaperCard.vue'
import { api } from '@/services/api'

const store = usePapersStore()

const singleTitle = ref('')
const singleDoi = ref('')
const singleVenue = ref('CVPR')
const singleYear = ref(2024)
const doiError = ref('')

const batchText = ref(`Segment Anything
CLIP: Learning Transferable Visual Models
DINOv2: Learning Robust Visual Features
3D Gaussian Splatting for Real-Time Radiance Field Rendering`)
const fileInputRef = ref(null)

const loading = ref(false)
const preview = ref([]) // [{title, paper? , error? , source:'status'}]
const batchSize = ref(0)
const allIngested = ref(false)

const canCrawlSingle = computed(() => singleTitle.value.trim().length >= 3)
const canCrawlBatch = computed(() => batchText.value.trim().split('\n').filter((l) => l.trim()).length >= 1)

/** 校验 DOI：必须形如 10.xxxx/yyyy */
function validateDoi(v) {
  const s = (v || '').trim()
  if (!s) return 'DOI 必填'
  if (!/^10\.\d{4,9}\/\S+$/i.test(s)) return 'DOI 格式应为 10.xxxx/yyyy（如 10.1109/CVPR52729.2024.00041）'
  return ''
}

async function crawlSingle() {
  if (!canCrawlSingle.value) return
  doiError.value = validateDoi(singleDoi.value)
  if (doiError.value) return
  loading.value = true
  try {
    const res = await api.search({
      q: singleTitle.value.trim(),
      venue: singleVenue.value,
      year: singleYear.value,
      crawl: true
    })
    if (res.crawled) {
      // 把用户填的 DOI 强制覆盖爬取结果（DOI 是用户的强约束）
      const crawled = { ...res.crawled, doi: singleDoi.value.trim() }
      preview.value = [{
        title: crawled.title,
        paper: crawled,
        source: crawled.source || 'crawled',
        status: 'crawled'
      }]
    } else if (res.matches?.length) {
      preview.value = res.matches.map((p) => ({
        title: p.title,
        paper: { ...p, doi: p.doi || singleDoi.value.trim() },
        source: 'local',
        status: 'exists'
      }))
    } else {
      preview.value = [{ title: singleTitle.value, status: 'empty' }]
    }
  } catch (e) {
    preview.value = [{ title: singleTitle.value, error: e.message }]
  } finally {
    loading.value = false
  }
}

async function crawlBatch() {
  loading.value = true
  preview.value = []
  batchSize.value = 0
  allIngested.value = false
  try {
    const titles = batchText.value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    if (titles.length === 0) {
      preview.value = [{ error: '请输入至少 1 个标题' }]
      return
    }
    const data = await store.crawl(titles)
    batchSize.value = data.results.length
    allIngested.value = data.inserted > 0
    preview.value = data.results.map((p) =>
      p.error
        ? { title: p.title, error: p.error, status: 'error' }
        : { title: p.title, paper: p, source: p.source, status: 'ok' }
    )
  } catch (e) {
    preview.value = [{ error: e.message }]
  } finally {
    loading.value = false
  }
}

function pickFile() {
  fileInputRef.value?.click()
}

/** 把爬取到的单条论文写入数据库；用于单篇爬取后的预览入库 */
async function ingestCrawled(index) {
  const item = preview.value[index]
  if (!item?.paper || item.status !== 'crawled') return
  item.saving = true
  try {
    const saved = await store.add(item.paper)
    preview.value[index] = {
      title: saved.title,
      paper: saved,
      source: saved.source || 'crawled',
      status: 'saved'
    }
  } catch (e) {
    preview.value[index] = { title: item.title, error: e.message }
  } finally {
    item.saving = false
  }
}

async function onFile(ev) {
  const file = ev.target.files?.[0]
  if (!file) return
  if (file.name.endsWith('.json')) {
    try {
      const arr = JSON.parse(await file.text())
      const titles = Array.isArray(arr)
        ? arr.map((x) => (typeof x === 'string' ? x : x.title)).filter(Boolean)
        : []
      batchText.value = titles.join('\n')
    } catch (e) {
      alert('JSON 解析失败：' + e.message)
    }
  } else {
    batchText.value = await file.text()
  }
  ev.target.value = ''
}
</script>

<template>
  <section>
    <header>
      <h1 class="h1">论文爬取 / 导入</h1>
      <p class="muted">单篇输入 → 联网爬取；批量导入 → 一键入库。支持 .txt / .json 文件。</p>
    </header>

    <div class="grid-2" style="margin-top:20px">
      <!-- 单篇输入 -->
      <div class="glass card">
        <h2 class="section-title">↧ 单篇输入</h2>
        <p class="section-sub">输入一篇论文标题，平台会按"精确 → 模糊 → 联网爬取"顺序检索</p>
        <div class="form">
          <label class="field-label">论文标题</label>
          <input v-model="singleTitle" class="input" placeholder="例如：Segment Anything" />

          <div>
            <label class="field-label required">
              DOI <span class="required-mark">*必填</span>
            </label>
            <input
              v-model="singleDoi"
              class="input"
              :class="{ 'input-error': doiError }"
              placeholder="10.1109/CVPR52729.2024.00041"
              @input="doiError = validateDoi(singleDoi)"
              @blur="doiError = validateDoi(singleDoi)"
            />
            <p v-if="doiError" class="error-text">{{ doiError }}</p>
          </div>

          <div class="form-row">
            <div style="flex:1">
              <label class="field-label">会议</label>
              <select v-model="singleVenue" class="select">
                <option>CVPR</option>
                <option>ICCV</option>
                <option>ECCV</option>
              </select>
            </div>
            <div style="width:120px">
              <label class="field-label">年份</label>
              <input v-model.number="singleYear" type="number" class="input" min="2000" max="2030" />
            </div>
          </div>

          <button class="btn btn-primary" :disabled="!canCrawlSingle || !!doiError || loading" @click="crawlSingle">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? '爬取中…' : '开始爬取' }}</span>
          </button>
        </div>
      </div>

      <!-- 批量导入 -->
      <div class="glass card">
        <h2 class="section-title">↧ 批量导入</h2>
        <p class="section-sub">一行一个标题；可粘贴或上传 .txt / .json 文件</p>
        <div class="form">
          <textarea
            v-model="batchText"
            class="textarea"
            placeholder="Segment Anything&#10;CLIP: Learning Transferable Visual Models&#10;..."
          ></textarea>
          <div class="actions">
            <button class="btn" @click="pickFile">📂 选择文件</button>
            <input ref="fileInputRef" type="file" accept=".txt,.json" hidden @change="onFile" />
            <button class="btn btn-primary" :disabled="!canCrawlBatch || loading" @click="crawlBatch">
              <span v-if="loading" class="spinner"></span>
              <span>{{ loading ? '批量爬取中…' : '批量爬取并入库' }}</span>
            </button>
          </div>
          <p v-if="batchSize > 0" class="tiny" style="margin-top:6px">
            本次处理 {{ batchSize }} 篇，{{ allIngested ? '已写入数据库' : '未新增入库' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 结果预览 -->
    <div class="glass card" style="margin-top:20px">
      <h2 class="section-title">预览结果</h2>
      <p class="section-sub">
        数据来源：
        <span class="tag tag-blue">local-seed</span>
        <span class="tag tag-green">dblp</span>
        <span class="tag tag-orange">synthesized</span>
        —— 真实部署时可由 DBLP 或会议官网替换
      </p>
      <div v-if="preview.length === 0" class="empty">还没有爬取结果</div>
      <div v-else class="list">
        <div v-for="(item, i) in preview" :key="i" class="list-row">
          <div style="flex:1;min-width:240px">
            <strong>{{ item.title }}</strong>
            <div class="tiny" style="margin-top:4px">
              <template v-if="item.error">
                <span style="color:var(--c-danger)">爬取失败：{{ item.error }}</span>
              </template>
              <template v-else-if="item.paper">
                <span :class="['tag', item.source === 'dblp' ? 'tag-green' : item.source === 'synthesized' ? 'tag-orange' : 'tag-blue']">
                  {{ item.source }}
                </span>
                · {{ item.paper.venue }} {{ item.paper.year }}
                <span v-if="item.paper.doi">· DOI: <code class="doi-inline">{{ item.paper.doi }}</code></span>
                · {{ (item.paper.authors || []).slice(0, 3).join(', ') }}
                <span v-if="item.status === 'saved'" class="tiny" style="color:var(--c-accent-3)">· 已入库</span>
              </template>
              <template v-else>
                <span class="muted">未命中</span>
              </template>
            </div>
          </div>
          <template v-if="item.paper">
            <!-- 已入库：可查看详情 -->
            <RouterLink v-if="item.status === 'saved' || item.status === 'exists'" :to="`/paper/${item.paper.id}`" class="btn btn-sm btn-primary">查看</RouterLink>
            <!-- 爬取结果（synthesized / dblp 未入库）：需要先入库 -->
            <button
              v-else-if="item.status === 'crawled' && !item.saving"
              class="btn btn-sm btn-primary"
              @click="ingestCrawled(i)"
            >入库</button>
            <span v-else-if="item.saving" class="tiny">入库中…</span>
          </template>
        </div>
      </div>
    </div>

    <div v-if="store.lastCrawl" style="margin-top:16px">
      <p class="tiny">最近一次成功爬取：<RouterLink :to="`/paper/${store.lastCrawl.id}`">{{ store.lastCrawl.title }}</RouterLink></p>
    </div>
  </section>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-row {
  display: flex;
  gap: 12px;
}
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
.error-text {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--c-danger);
}
.doi-inline {
  background: rgba(0, 0, 0, 0.35);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #c4b5fd;
}
</style>