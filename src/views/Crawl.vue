<script setup>
/**
 * 论文爬取 / 导入页 —— GitHub Pages 静态版本。
 *
 * 真实部署时，本页会调后端 /api/crawl 单 / 批量从 DBLP 拉元数据并写入数据库。
 * 在 GitHub Pages 静态部署下：
 *   - 没有后端，写库无意义
 *   - 浏览 / 搜索请到「Manage」页，已包含筛选 + 关键词搜索
 *   - 数据全集由 build 阶段从 OpenAlex 预拉到 public/papers.json
 *
 * 这里保留 UI 是为了提示用户「原本这里有爬取功能」，避免路由 404。
 */
import { ref, computed, onMounted } from 'vue'
import { usePapersStore } from '@/store/papers'

const store = usePapersStore()
onMounted(() => store.load())

const sampleTitles = ref(`Segment Anything
CLIP: Learning Transferable Visual Models
DINOv2: Learning Robust Visual Features without Supervision
3D Gaussian Splatting for Real-Time Radiance Field Rendering`)

const keyword = ref('')
const localMatches = computed(() => {
  if (!keyword.value.trim()) return []
  const q = keyword.value.trim().toLowerCase()
  return store.papers.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.keywords || []).some((k) => k.toLowerCase().includes(q))
  ).slice(0, 8)
})
</script>

<template>
  <section>
    <header>
      <h1 class="h1">论文爬取 / 导入</h1>
    </header>

    <div class="grid-2" style="margin-top:20px">
      <div class="glass card">
        <h2 class="section-title">↧ 单篇输入</h2>
        <p class="section-sub">输入一篇论文标题，平台会按"精确 → 模糊 → 联网爬取"顺序检索</p>
        <div class="form">
          <label class="field-label">论文标题</label>
          <input class="input" placeholder="例如：Segment Anything" disabled />
          <label class="field-label">DOI</label>
          <input class="input" placeholder="10.1109/CVPR52729.2024.00041" disabled />
          <button class="btn btn-primary" disabled title="GitHub Pages 静态部署不支持联网爬取">
            开始爬取（已禁用）
          </button>
        </div>
      </div>

      <div class="glass card">
        <h2 class="section-title">↧ 批量导入</h2>
        <p class="section-sub">一行一个标题；可粘贴或上传 .txt / .json 文件</p>
        <div class="form">
          <textarea v-model="sampleTitles" class="textarea" disabled></textarea>
          <div class="actions">
            <button class="btn" disabled>📂 选择文件</button>
            <button class="btn btn-primary" disabled title="GitHub Pages 静态部署不支持联网爬取">
              批量爬取并入库（已禁用）
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="glass card" style="margin-top:20px">
      <h2 class="section-title">本地数据预览</h2>
      <p class="section-sub">
        build 时从 <a href="https://openalex.org" target="_blank" rel="noopener">OpenAlex</a>
        预拉到 <code>papers.json</code> 的 {{ store.papers.length }} 篇 CV 三会论文 ·
        在 <RouterLink to='/manage'>Manage</RouterLink> 页用搜索 / 筛选体验
      </p>

      <label class="field-label" style="margin-top:12px">快速搜索（演示）</label>
      <input v-model="keyword" class="input" placeholder="试试：diffusion / SAM / transformer" />
      <div v-if="keyword && !localMatches.length" class="empty" style="margin-top:12px">
        当前预拉数据中没匹配，换个关键词
      </div>
      <ul v-else-if="localMatches.length" class="demo-list">
        <li v-for="p in localMatches" :key="p.id">
          <span class="tag" :class="`tag-${p.venue === 'CVPR' ? 'blue' : p.venue === 'ICCV' ? 'orange' : 'green'}`">
            {{ p.venue }} {{ p.year }}
          </span>
          <RouterLink :to="`/paper/${p.id}`">{{ p.title }}</RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.demo-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.demo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
}
</style>