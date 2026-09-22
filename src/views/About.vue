<script setup>
/**
 * 「了解更多」附加功能：介绍 CVPR / ICCV / ECCV、统计口径、数据来源。
 */
</script>

<template>
  <section>
    <header>
      <h1 class="h1">了解更多</h1>
      <p class="muted">关于 CV 三会、数据来源、统计口径与本项目实现说明。</p>
    </header>

    <div class="grid-3" style="margin-top:16px">
      <article class="glass card">
        <h2 class="section-title">CVPR</h2>
        <p class="muted">国际计算机视觉与模式识别会议</p>
        <p style="line-height:1.65">
          由 IEEE 与 CVF 联合主办，每年举办一次，是计算机视觉领域规模最大、影响最广的顶级会议。
          2025 年投稿 13008 篇，接收 2878 篇。
        </p>
        <ul style="padding-left:18px;color:var(--c-text-dim);line-height:1.8">
          <li>举办频次：每年</li>
          <li>通常 6 月截稿、12 月举办</li>
          <li>覆盖：识别、检测、分割、生成、3D、底层视觉等</li>
        </ul>
      </article>

      <article class="glass card">
        <h2 class="section-title">ICCV</h2>
        <p class="muted">国际计算机视觉大会</p>
        <p style="line-height:1.65">
          由 IEEE / CVF 主办，奇数年举办。每两年一次与 CVPR 交替，被引用量常年位居 CV 领域前列。
        </p>
        <ul style="padding-left:18px;color:var(--c-text-dim);line-height:1.8">
          <li>举办频次：奇数年</li>
          <li>通常 7 月截稿、10 月举办</li>
          <li>强调理论突破与系统化成果</li>
        </ul>
      </article>

      <article class="glass card">
        <h2 class="section-title">ECCV</h2>
        <p class="muted">欧洲计算机视觉国际会议</p>
        <p style="line-height:1.65">
          由 ECCV 指导委员会主办，偶数年举办，欧洲最具影响力的 CV 顶会。
        </p>
        <ul style="padding-left:18px;color:var(--c-text-dim);line-height:1.8">
          <li>举办频次：偶数年</li>
          <li>通常 3 月截稿、10 月举办</li>
          <li>重视方法多样性与跨学科融合</li>
        </ul>
      </article>
    </div>

    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">数据来源</h2>
      <ul style="padding-left:18px;line-height:1.85">
        <li>
          种子数据：基于 CVPR / ICCV / ECCV 公开接收论文清单整理，
          真实部署可通过 <a href="https://dblp.org/" target="_blank">DBLP</a>
          公开 API（<code>https://dblp.org/search/publ/api</code>）爬取最新元数据。
        </li>
        <li>
          本地浏览器地址：实时爬取时优先匹配本地库（毫秒级），未命中再走 DBLP。
        </li>
        <li>
          <strong>仅用于课程教学</strong>，请勿用于商业用途。
        </li>
      </ul>
    </div>

    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">统计口径</h2>
      <table class="table">
        <thead><tr><th>项目</th><th>说明</th></tr></thead>
        <tbody>
          <tr><td>分词</td><td>英文按非字母数字拆分；中文按 2~3 字 ngram</td></tr>
          <tr><td>停用词</td><td>英文通用停用词 + 领域弱信号词（如 "image / model / paper / method"）</td></tr>
          <tr><td>频次</td><td>论文中关键词出现次数（关键词由作者标注或自动抽取）</td></tr>
          <tr><td>热度</td><td>= 词频 × (1 + 年增长率)；用于 Top 排序</td></tr>
          <tr><td>共现</td><td>同一篇论文中两个关键词共同出现的次数，用于图谱边权重</td></tr>
        </tbody>
      </table>
    </div>

    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">技术栈</h2>
      <div class="grid-3">
        <div>
          <h3 class="h2">前端</h3>
          <p class="muted">Vue 3 · Vite · Pinia · Vue Router · ECharts · vue-echarts</p>
        </div>
        <div>
          <h3 class="h2">后端</h3>
          <p class="muted">Node.js · Express · better-sqlite3 · CORS</p>
        </div>
        <div>
          <h3 class="h2">部署</h3>
          <p class="muted">单端口同时服务 API 与前端静态资源；华为云 ECS / CodeArts 一键启动</p>
        </div>
      </div>
    </div>

    <div class="glass card" style="margin-top:16px">
      <h2 class="section-title">AI 结对协作</h2>
      <p>
        本项目在与 AI 结对过程中完成：需求拆解、NABCD 梳理、原型草图、关键词算法迭代、UI 细节调优、bug 排查。
        完整的过程与代表性案例请见博客中的「人机协作」章节。
      </p>
    </div>
  </section>
</template>

<style scoped>
code {
  background: rgba(0,0,0,0.4);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
}
</style>