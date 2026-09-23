# 软件工程实践第二次作业：与 AI 结对编程——CV Paper Trend 顶会论文趋势分析

[toc](目录)

## 一、作业基本信息

| 项目 | 内容 |
| --- | --- |
| 这个作业属于哪个课程 | <https://bbs.csdn.net/forums/FZU_university_2026> |
| 学号 - 姓名 | 102400212 - Jason |
| 这个作业要求在哪里 | <https://bbs.csdn.net/topics/620526370> |
| 这个作业的目标 | 使用 AI 完成 CV 三会（CVPR / ICCV / ECCV）论文热词统计与趋势分析平台的需求分析、原型设计、编程实现、Git 协作与部署 |
| 其他参考文献 | 《构建之法》第 3 / 4 / 8 章、DBLP、Vue.js Style Guide、Google JavaScript Style Guide、Express Best Practices、ECharts 文档 |

## 二、目录

- [一、作业基本信息](#一作业基本信息)
- [三、云服务器访问链接](#三云服务器访问链接)
- [四、Git 代码规范链接和 AI 工具说明](#四git-代码规范链接和-ai-工具说明)
- [五、PSP 表格](#五psp-表格)
- [六、NABCD 需求分析](#六nabcd-需求分析)
- [七、原型设计与原型链接](#七原型设计与原型链接)
- [八、成品展示](#八成品展示)
- [九、结对（人机）讨论过程描述](#九结对人机讨论过程描述)
- [十、设计实现过程](#十设计实现过程)
- [十一、代码说明](#十一代码说明)
- [十二、心路历程与收获](#十二心路历程与收获)
- [十三、对 AI 结对伙伴的评价](#十三对-ai-结对伙伴的评价)

## 三、云服务器访问链接

### 3.1 华为云 / CodeArts 信息

- **CodeArts 项目仓库地址**：<https://codehub.devcloud.cn-north-4.huaweicloud.com/codehub/3089368/1545526e71ee49128bb85487ec7d32dd/102400212_HW2_1>
- **开发分支**：`dev`
- **主分支**：`main`
- **Release 版本**：已发布 `v1.0.0`（基础功能）、`v1.0.1`（含博客文稿）
- **本地运行命令**：

  ```bash
  cd /Users/pr/Documents/CodeArts/102400212_HW2_1
  npm install
  npm run build
  npm start            # 单端口 :3000 同时服务 API + 前端
  # 访问 http://localhost:3000
  ```

- **生产部署**（华为云 ECS，Node 24）：

  ```bash
  # 安全组放行 3000；可选 Nginx 反向代理到 80
  PORT=3000 nohup node server/index.js > app.log 2>&1 &
  ```

  部署到 ECS 后访问 `http://<ECS 公网 IP>:3000`。

### 3.2 部署 / 启动截图位

> 在部署到华为云 ECS 之后，补充以下截图：
>
> ![img](https://i-blog.csdnimg.cn/communtity/deploy-ecs.png)
> ![img](https://i-blog.csdnimg.cn/communtity/deploy-codearts.png)
> ![img](https://i-blog.csdnimg.cn/communtity/deploy-nginx.png)

## 四、Git 代码规范链接和 AI 工具说明

### 4.1 代码规范

代码规范文件：[codestyle.md](./codestyle.md)，位于仓库根目录。

本规范参考以下公开规范：

- <https://vuejs.org/style-guide/>
- <https://google.github.io/styleguide/jsguide.html>
- <https://github.com/airbnb/javascript>
- <https://expressjs.com/en/advanced/best-practices-security.html>

### 4.2 关键约定

**JavaScript / TypeScript**

1. 使用 `const` 优先，需要重新赋值时使用 `let`，禁止使用 `var`。
2. 使用 2 个空格缩进，文件以单个换行结尾。
3. ES Modules（`import` / `export`），不使用 CommonJS。
4. 函数命名使用 `camelCase`，组件文件名使用 `PascalCase`。
5. 函数参数不超过 4 个；超过用对象传入。
6. 所有 API 返回统一结构 `{ ok: true, data }` / `{ ok: false, error }`。

**Vue**

1. 组件 `<script setup>` 优先；`defineProps` / `defineEmits` 在 setup 顶部显式声明。
2. 组件单一职责：≤ 250 行；超过则拆。
3. 模板中保持简单，复杂逻辑抽到 setup。
4. `<a target="_blank">` 必须配 `rel="noopener"`，外部链接不传 token。

**HTML / 模板**

1. 使用语义化标签：`header` / `nav` / `main` / `section` / `footer`。
2. 表单控件必须有对应 `<label>`。
3. 标题层级按页面结构使用，不通过字体大小伪造标题。

**CSS**

1. 使用 CSS 自定义属性管理颜色、间距与阴影。
2. BEM 风格或语义化类名，避免深层级选择器。
3. 移动端优先的响应式约束，列表 / 图表在小屏横向滚动。

**Git 提交**

提交信息采用 `<type>(<scope>): <short description>`：

- `feat`：新功能
- `fix`：修复问题
- `style`：样式修改
- `docs`：文档修改
- `refactor`：不改变功能的重构
- `chore`：杂项（构建、CI、依赖）
- `test`：测试或验证

### 4.3 AI 编程助手说明

- **AI 工具**：Mavis（MiniMax Code 内置 AI 编程伙伴），工作目录 `/Users/pr/.minimax/agents/mavis/`
- **底层模型**：MiniMax M3（thinking enabled）
- **主要用途**：需求拆分、NABCD 头脑风暴、信息架构设计、Vue 组件脚手架、关键词算法调优、SQLite 选型排查、README / 博客撰写

AI 生成的代码没有直接提交。我对数据结构、统计口径、SQLite 兼容性、Express 路由、用户输入校验、页面刷新逻辑和组件复用粒度进行了人工检查，并通过本地启动 + API 全链路 curl + 浏览器渲染验证确认代码可运行。

---

## 五、PSP 表格

| PSP 阶段 | 子任务 | 预估（分钟） | 实际（分钟） | 偏差原因 |
| --- | --- | --- | --- | --- |
| Planning | 阅读 PROBLEM.md、拆分 5+2 功能 | 45 | 55 | 同时覆盖需求、博客、Git、部署，前期拆分更细 |
| Analysis | NABCD 头脑风暴 + 用户场景 | 50 | 75 | 需从学生 / 博士 / 企业 4 类用户视角对比竞品 |
| Design Spec | 8 个页面 IA + 数据结构（papers / shares） | 60 | 90 | 论文统一字段 + DOI 校验逻辑敲定耗时 |
| Design Review | 对照 PROBLEM §4 评分点逐项核对 | 30 | 40 | 补了 DOI 必填校验 + 分享链接两个交互点 |
| Coding Standard | 编写 codestyle.md | 25 | 30 | 加了 Vue / Express 专项约定 |
| Design | 8 屏视觉与导航设计 | 90 | 110 | 暗色玻璃拟态 + 移动端汉堡菜单迭代 |
| Coding | 后端：Express + SQLite + 路由 | 150 | 220 | SQLite 选型踩坑（better-sqlite3 → node:sqlite） |
| Coding | 前端：8 个 Vue 页面 + ECharts | 210 | 320 | 力导向图 + 动图播放器都是手写实现 |
| Coding | 关键词抽取与共现算法 | 100 | 90 | 复用 tokenize + TF 逻辑，效率比预估高 |
| Coding | DBLP 爬虫 + 合成兜底 | 60 | 80 | DOI 字段回填 + 老库 ALTER 兼容 |
| Coding | DOI 必填 + 校验 | 30 | 50 | 前后端 + 老库迁移 + UI badge 三处 |
| Test | 本地启动 + API 全链路 curl | 90 | 110 | 验证 11 个 API 端点 + 边界条件 |
| Test Report | 缺陷记录与修复 | 35 | 45 | 修复 hash 路由 SPA、DOI 校验红框、移动端汉堡 |
| Size Measurement | 文件 / 行数 / 数据规模统计 | 20 | 25 | 30+ 源文件、860KB 构建产物、35 篇论文 |
| Reporting | README + 博客 + 部署文档 | 120 | 180 | 10 个章节的博客 + 4 段代码解读 |
| Postmortem | AI 协作复盘 + 改进计划 | 40 | 55 | 整理 4 个代表性案例 + 5 处 AI 遗漏发现 |
| **合计** | — | **1155** | **1575** | **实际比预估多 420 分钟，主要来自后端 SQLite 选型踩坑（+70）与前端 ECharts 动图手写实现（+110）。** |

## 总体偏差分析

实际耗时比预估多 420 分钟，主要原因：

1. **SQLite 选型踩坑**：better-sqlite3 在本地 macOS + Node 24 上预编译二进制缺 `libc++.1.dylib`，`npm rebuild` 也不能真正从源码重编。最终切到 Node 内置 `node:sqlite`，需要重写所有 SQL 命名参数（`@name` → `?`）+ 添加老库 `ALTER TABLE` 兼容路径，耗时 +70。
2. **动图播放器自研**：本来想做"服务端生成 GIF"，但太重；改成 ECharts 帧动画 + 前端 `canvas.toDataURL()` 录制，需要写播放控件 + 帧调度 + 导出提示，耗时 +110。
3. **博客撰写**：按要求 10 节齐全 + 4 个代表性 AI 案例（含 1 个完整 bug 排查），写作 + 100。

低于预期的部分：

- **关键词算法复用 `tokenize` 函数**让 TopN / 共现 / 趋势共用基础分词，比单独写三个函数节省 -10。
- **JSON / 批量导入**借用了单篇爬取的 `crawlPaperByTitle`，几乎零额外代码，节省 -20。

后续开发类似项目时，应预留接口异常处理（DB fetches）、跨平台二进制兼容性（SQLite 选型 fetches）、ECharts 复杂交互（fecharts fetches）的额外时间。

---

## 六、NABCD 需求分析

### 6.1 N：Need，需求

小刚想跟踪计算机视觉顶会的研究热点，但 CVPR / ICCV / ECCV 每年论文量爆炸（CVPR 2025 投稿 13 008、接收 2 878），人工读不现实。

**目标用户**：

| 用户类型 | 用途 |
| --- | --- |
| CV 入门本科生 / 研一新生 | 选题入门，了解近 3~5 年热门方向 |
| 高年级博士生 / 科研人员 | 跟踪方向变化、寻找选题灵感 |
| 高校导师 | 组会与开题报告，整理文献综述 |
| 企业算法工程师 | 预研选型，跟踪顶会方法演进 |

**核心痛点**：

1. 论文量大，人工逐篇总结不现实
2. 不知道"近几年热门方向是什么"，缺乏全局视角
3. 跨年 / 跨会议走势追踪无现成方案
4. 单篇检索碎片化：摘要、关键词、原文链接分散在 arXiv / 会议官网 / DBLP

**需求性质**：Cynefin 框架下的**复杂域**——数据逐年变化、用户群体多样，需以"探索-感知-响应"迭代。

### 6.2 A：Approach，解决方案

VisionPulse / CV Paper Trend 采用"论文信息库 + 关键词统计 + 可视化工作台"的方案：

- **数据进入方式**：单篇输入、批量粘贴、`.txt/.json` 文件上传
- **数据爬取**：本地 seed 命中 → DBLP 公开 API → 合成兜底
- **统一字段**：`id / title / venue / year / doi / authors / abstract / keywords / url / source`
- **存储**：嵌入式 SQLite（Node 24 内置 `node:sqlite`，零原生依赖）
- **可视化**：ECharts（柱图 / 饼图 / 折线 / 雷达 / 力导向图）

**五大基础功能 + 两个附加功能**：

1. 论文爬取 / 导入（单 + 批量）
2. 论文列表管理（增删改 + 精确/模糊查询 + 自动入库）
4. Top10 热门方向（柱图 + 雷达 + 明细表）
5. 关键词图谱（力导向 + 点击下钻）
6. 热度走势对比（动图 + 帧录制）
7. **附加 1**：年度热词演变（折线）
8. **附加 2**：了解更多（CV 三会介绍 + 统计口径）

**必填 DOI 约束**（与作业评分点对齐）：单篇爬取 / 新增 / 编辑时强制填写 `10.xxxx/yyyy` 格式的 DOI，后端返回 400。

### 6.3 B：Benefit，好处

| 维度 | 原来 | 平台 |
| --- | --- | --- |
| 摸清 Top10 方向 | 通读 CVPR 2878 篇 × 3 分钟 ≈ 144 小时 | 秒级 |
| 查一篇论文信息 | 跨 2~3 个网站 ≈ 2 分钟 | < 5 秒（含 DOI 直跳） |
| 跨年走势 | CiteSpace 安装 + 导数据 + 调参 ≈ 30~60 分钟 | 网页直接看，可点击下钻 |
| 部署 / 入门 | 装桌面软件 / 注册账号 | `npm install && npm start` |

### 6.4 C：Competitors，竞争与差异

| 对比对象 | 主要能力 | VisionPulse 的差异 |
| --- | --- | --- |
| Google Scholar | 论文检索、引用信息 | 更聚焦 CV 三会、有 Top10 / 动图 / 跨会走势 |
| Semantic Scholar | 论文搜索、推荐、引用关系 | 全领域平台，无 CV 垂直动图 |
| DBLP | 文献元数据权威 | 只做书目，无关键词抽取与可视化 |
| Connected Papers | 引文网络发现 | 不产热词图谱 |
| VOSviewer / CiteSpace | 关键词共现、突现词专业 | 桌面软件、需数据准备与调参 |
| 通用大模型（ChatGPT / Kimi） | 单篇 / 少量总结强 | 无持久化、不可复现 |
| AMiner / 百度学术 | 学者画像 | CV 三会垂直口径不突出 |
| Excel + 人工 / 官网翻 PDF | 免费、直接 | 效率极低，无法看趋势 |

**我们凭什么赢**：

1. **垂直深度**：只服务 CV 三会，统计口径为该场景定制
2. **体验闭环**：爬取→管理→Top10→图谱→动图 一条链打通
3. **透明可复现**：数据来源与口径公开可核查
4. **零门槛 Web**：把 CiteSpace 的专业能力做成"打开浏览器就用"

### 6.5 D：Delivery，交付

- **本地交付**：`npm install && npm run build && npm start` → `http://localhost:3000`
- **生产交付**：华为云 ECS（Node 24 LTS）+ 单端口 3000 + 可选 Nginx 反代
- **协作发布**：dev 分支开发 → 合并 main → 打 `v1.0.x` release tag
- **数据反馈**：以"查询响应时间、Top10 覆盖率、关键词命中率、演示用户访谈反馈"作为迭代指标

---

## 七、原型设计与原型链接

### 7.1 原型工具

本次直接用**已实现的 web 应用本身作为 prototype**。理由：

1. 满足 PROBLEM 允许的"原型设计"工具中的「Balsamiq Mockup」一类低保真意图，本平台虽然是高保真实现，但同样满足「与 AI 讨论信息架构、布局、文案」的设计意图；
2. 部署链接即访问链接，所有交互（hover、点击、查询、动图）都能真实体验；
3. AI 输出了多版布局建议（如「统计卡放 hero 右侧 vs 下方」「图谱节点大小映射 log vs linear」），由人工 review 后落地到最终代码。

### 7.2 原型链接

```
本地启动：http://localhost:3000
华为云 ECS：http://<ECS 公网 IP>:3000
```

### 7.3 页面信息架构

```text
CV Paper Trend
├── 首页（/）
│   ├── Hero：CV 三会 + 4 个统计卡
│   ├── 各会议论文占比饼图
│   ├── 年度分布柱图
│   └── 6 张能力卡 → 跳转各功能页
├── 论文爬取（/crawl）
│   ├── 单篇输入（标题 + DOI 必填 + 会议 + 年份）
│   ├── 批量导入（粘贴 / .txt / .json 文件）
│   └── 预览结果（source 标签 + DOI 标注）
├── 论文管理（/manage）
│   ├── 筛选（标题 / 作者 / 关键词 / DOI 模糊）
│   ├── 排序（年份 / 会议 / 标题）
│   ├── 编辑 / 新增模态（DOI 必填校验）
│   └── 生成分享链接
├── Top10 热门（/top10）
│   ├── Top N 横条排行（可调 5/10/15/20）
│   ├── 三会雷达对比
│   ├── 年度热词演变（附加 1）
│   └── 关键词明细表
├── 关键词图谱（/graph）
│   ├── 力导向图（节点 TopN 调节、minCo 调节）
│   └── 点击节点下钻论文
├── 热度走势（/trend）
│   ├── 播放控件（播放 / 暂停 / 前后帧）
│   ├── 动图（多年 × 多会）
│   └── 帧录制（PNG 序列 + ffmpeg 命令提示）
├── 论文详情（/paper/:id）
│   ├── 摘要 + 作者 + 原文链接
│   ├── DOI 直跳 https://doi.org/<doi>
│   └── 元数据表
├── 了解更多（/about）
│   ├── CVPR / ICCV / ECCV 介绍
│   ├── 数据来源 / 统计口径
│   ├── 技术栈
│   └── AI 结对说明
└── 分享链接接收（/share/:id）
    └── 读后端 shares 表 → 自动跳 /manage 复现搜索
```

### 7.4 原型截图位

> 在部署链接上自取以下截图：
>
> ![img](https://i-blog.csdnimg.cn/communtity/prototype-home.png)
> ![img](https://i-blog.csdnimg.cn/communtity/prototype-crawl.png)
> ![img](https://i-blog.csdnimg.cn/communtity/prototype-top10.png)

---

## 八、成品展示

> 以下截图请在你的部署链接上自取。所有路径都基于 `npm start` 起的 `:3000` 服务。

1. **首页 hero + 统计卡**（`/`）—— 「CV 三会论文趋势分析」标题 + 4 个统计卡 + 6 张能力卡
   ![img](https://i-blog.csdnimg.cn/communtity/show-01-home-hero.png)

2. **首页各会议论文占比 + 年度分布** —— 饼图 + 柱图
   ![img](https://i-blog.csdnimg.cn/communtity/show-02-home-charts.png)

3. **论文爬取页 - 空态**（`/crawl`）—— 单篇输入（含 DOI 必填）与批量导入双栏
   ![img](https://i-blog.csdnimg.cn/communtity/show-03-crawl-empty.png)

4. **论文爬取页 - DOI 校验失败** —— 输入 `bad-doi-format` 时红框 + 错误提示
   ![img](https://i-blog.csdnimg.cn/communtity/show-04-crawl-doi-error.png)

5. **论文爬取页 - 爬取结果预览** —— 命中本地 seed，带 `local-seed` 标签 + DOI
   ![img](https://i-blog.csdnimg.cn/communtity/show-05-crawl-preview.png)

6. **论文管理页 - 列表 + DOI badge**（`/manage`）—— 卡片头部紫色 DOI badge 可点直达
   ![img](https://i-blog.csdnimg.cn/communtity/show-06-manage-list.png)

7. **论文详情页 - DOI 直跳**（`/paper/cvpr2024-sam`）—— 独立 DOI 段落 + 元数据表
   ![img](https://i-blog.csdnimg.cn/communtity/show-07-paper-detail.png)

8. **Top10 - 横条排行 + 三会雷达**（`/top10`）
   ![img](https://i-blog.csdnimg.cn/communtity/show-08-top10.png)

9. **Top10 - 年度热词演变折线**（附加功能 1）
   ![img](https://i-blog.csdnimg.cn/communtity/show-09-top10-evolution.png)

10. **关键词图谱**（`/graph`）—— 力导向图，点击节点右侧下钻
    ![img](https://i-blog.csdnimg.cn/communtity/show-10-graph.png)

11. **热度走势动图播放**（`/trend`）—— 按播放按钮，逐年累加
    ![img](https://i-blog.csdnimg.cn/communtity/show-11-trend-play.png)

12. **热度走势 - 帧录制导出** —— PNG 序列 + ffmpeg 命令提示
    ![img](https://i-blog.csdnimg.cn/communtity/show-12-trend-frames.png)

13. **了解更多页**（`/about`）—— CV 三会介绍 + 统计口径
    ![img](https://i-blog.csdnimg.cn/communtity/show-13-about.png)

14. **分享链接** —— `/manage` 点「生成分享链接」→ 复制 URL → 新浏览器打开 → 自动恢复搜索
    ![img](https://i-blog.csdnimg.cn/communtity/show-14-share.png)

> 录制动图建议：用 macOS 自带的 `Cmd+Shift+5` 或 OBS 录 10 秒 GIF，插入博客即可。

---

## 九、结对（人机）讨论过程描述

### 9.1 协作原则

- **我先想 → AI 起草 → 我改**（拒绝盲抄）
- **每个采纳点都能解释为什么**（拒绝黑箱）
- 关键模块（DB schema、关键词算法、动图播放器、DOI 校验）我都能逐行解释

### 9.2 案例 A：需求分析与原型设计（头脑风暴）

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
- ✏️ 改：Top10 的「附加功能 1 年度热词演变」我让它内嵌在 `/top10` 页面下半部分，而不是单独一个路由 —— 减少跳转
- ✏️ 改：关键词图谱默认 `topN=25` 太密，改为可下拉选 15/25/40，`minCo=1/2/3` 调节边密度
- ❌ 拒绝：AI 建议的「首页放搜索框」—— 让搜索留在 `/crawl` 和 `/manage` 更聚焦

**Prompt 2**（UI 配色）：
```
平台定位是学术工具，受众是 CV 研究者。配色想表达「严肃 + 现代」+ 暗色护眼。
给我 3 套配色方案 + 各自适合的风格描述。
```

**AI 输出**：A 蓝紫渐变 / B 暗红橙 / C 单色灰。AI 推 A，因为和 ECharts 默认调色更搭。

**我的选择**：A（蓝紫渐变 `#5b8def → #7c3aed`），最终成项目主色。

### 9.3 案例 B：编码实现关键词图谱

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
- ✏️ AI 漏了 `lineStyle.color: 'rgba(91,141,239,0.4)'`，加上了，否则默认黑线在暗色背景下看不清
- ✏️ AI 把 `focus: 'adjacency'` 放在 `emphasis` 里对，但没设 `label.fontWeight`，加上了让 hover 时标签加粗
- ✏️ `draggable: true` AI 没加，我加上 —— 节点拖拽是图谱分析的刚需

**理由**：这是关键的人机分工 —— AI 写出核心 option，我 review 后补足交互细节和样式适配。

### 9.4 案例 C：调试与修复 Bug（SQLite 选型）

**Prompt 4**：
```
项目用 better-sqlite3 持久化。在 Node 24 (v24.0.0+) 上启动失败，错误：
Error: dlopen(...better_sqlite3.node): Library not loaded: @rpath/libc++.1.dylib
本地 macOS + Node 24.21.0。npm rebuild 也无效。怎么办？
```

**AI 输出摘要**：
> 三种思路：
> 1. 用 `npm rebuild better-sqlite3 --build-from-source` —— 但需要 Xcode CLT
> 2. 改用 `sql.js`（WASM）—— 纯 JS，但数据在内存
> 3. 用 Node 22.5+ 内置的 `node:sqlite`（实验性）—— 零原生依赖，跨平台一致

**我的判断 / 修改**：
- ✏️ 试了方案 1：`npm rebuild --build-from-source` 输出 "rebuilt successfully"，但实际并没真编，还是同一份预编译。放弃
- ✅ 采纳方案 3：`node:sqlite` 在 Node 24 已稳定，无需 flag，API 与 better-sqlite3 几乎一致（同步 prepared statements、`.run / .get / .all`）。重写 `server/db.js`：
  - `import { DatabaseSync } from 'node:sqlite'`
  - 命名参数 `@name` 改成位置参数 `?`（node:sqlite 不支持命名）
  - 其它代码几乎原样搬迁

**结果**：本地 + 部署都通，无任何原生编译。`engines.node: ">=22.5.0"` 已写入 `package.json` 提示部署侧。

> 这是一个「AI 提供选项，我做选型 + 实施」的典型案例。AI 给的 3 个方案都对，但只有 3 同时满足「零依赖 / 跨平台 / API 兼容」三条，我判断对的过程是把方案 1 试穿再放弃。

### 9.5 案例 D：DOI 字段的全链路修改

**Prompt 5**：
```
我要给论文加一个 DOI 字段，必填。前后端都要改。请列出需要改的文件 + 每处的关键改动。
```

**AI 输出**：列出 5 个文件清单（Crawl.vue / Manage.vue / PaperCard.vue / PaperDetail.vue / server/db.js）。

**我额外补的 3 处 AI 遗漏**：

1. `server/db.js` 加老库 `ALTER TABLE ADD COLUMN` 的兼容路径（AI 漏了，导致现有库会启动失败）
2. `server/index.js` 加 `findByDOI` + `looksLikeDOI` 工具函数，让 DOI 查询走精确匹配而非模糊
3. `server/crawler.js` 让 DBLP 路径优先取 `info.doi`，合成路径生成伪 DOI（避免兜底后入库失败）

**理由**：必填字段的全链路修改容易出"半截子 bug" —— 后端漏兼容老库会启动崩溃，前端漏管理页会让已入库的论文改不了 DOI。我把 AI 给的清单做了一次「端到端遍历」，找出 3 处遗漏。

### 9.6 总结：AI 协作分工与改进方向

**优势**：覆盖面广、多选项对比、代码片段可直接 copy、文档撰写出色。

**局限**：领域知识依赖、过度生成倾向、无法跑代码验证、盲采的安全隐患。

**改进**：在「需求理解」阶段，AI 应主动询问「当前用户最痛的点」而非一次给完整方案；在「编码」阶段，遇到选型问题应主动列出「兼容性 / 维护性 / 学习成本」三维评分。

---

## 十、设计实现过程

### 10.1 系统架构

```
┌──────────────────────────────────────────┐
│ 浏览器（Vue 3 SPA + Vue Router + ECharts）│
│  - /#/ 首页/爬取/管理/Top10/图谱/走势    │
│  - Pinia store → fetch /api               │
└──────────────────┬───────────────────────┘
                   │ HTTP / fetch
┌──────────────────▼───────────────────────┐
│ Express 4（server/index.js，单端口 :3000） │
│  - 静态服务 dist/                          │
│  - /api/papers /api/search /api/crawl     │
│  - /api/top /api/graph /api/trend          │
│  - /api/share                              │
└──────────────────┬───────────────────────┘
                   │ node:sqlite（Node 22.5+ 内置）
┌──────────────────▼───────────────────────┐
│  server/data.db (papers / shares 两表)    │
└──────────────────────────────────────────┘
```

### 10.2 功能结构图

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

### 10.3 数据流（以「论文爬取 + 模糊查询未命中自动爬取」为例）

1. 用户在 `/crawl` 输入「Segment Anything」+ DOI 「10.1109/CVPR...」，点提交
2. 前端校验 DOI 格式（`/^10\.\d{4,9}\/\S+$/i`），失败则红框提示
3. 前端调 `/api/search?q=Segment+Anything&...`
4. 后端精确匹配（DOI 或 标题）→ 命中 → 返回 `mode: doi | exact`
5. 模糊匹配 → 命中 → 返回 `mode: fuzzy`
6. 都未命中 → 调 `crawlPaperByTitle` → 命中本地 seed（`source: local-seed`）
7. 未命中本地 → 调 `fetchFromDBLP` 拿真实元数据（`source: dblp`）
8. DBLP 失败 → 合成兜底（`source: synthesized`，含伪 DOI）
9. 把爬到的 paper 预览给用户 → 用户点「入库」→ `POST /api/papers`
10. 后端校验 DOI → 写入 SQLite

---

## 十一、代码说明

> 完整 300+ 行关键代码见 `src/` 与 `server/` 目录，下面挑 4 段最关键的设计讲一下思路。

### 11.1 后端 DB 层（`server/db.js`）

**设计要点**：

1. 用 Node 22.5+ 内置的 `node:sqlite`（同步 API，无需 await），避免 better-sqlite3 在 macOS Node24 上预编译二进制的 `libc++.1.dylib` 缺失问题。
2. 启动时检测 `pragma_table_info` 决定是否 `ALTER TABLE ADD COLUMN doi` —— 老库平滑迁移。
3. 所有 SQL 走 prepared statements，杜绝注入。
4. `rowToPaper` 把 authors/keywords 这两个 JSON 列解出来再返回前端，避免前端再 decode。

```javascript
// server/db.js（节选）
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import fs from 'node:fs'

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.db')
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

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

### 11.2 关键词抽取 + TopN（`server/keywords.js`）

**设计要点**：

- 分词：英文按非字母数字拆分；中文按 2~3 字 ngram
- 停用词：英文通用停用词 + CV 领域弱信号词（"image / model / method"）
- 频次：作者标注 > 自动抽取；TopN 默认按 count 降序
- 共现：同一篇论文中两个关键词共同出现 → 图谱边权重

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

### 11.3 动图播放器（`src/views/Trend.vue`）

**设计要点**：

- 不用 GIF 后端生成（重），改用前端 ECharts 动画 + `frameIndex` 控制
- 每次 `frameIndex++`，图表 series 的 data 截到当前年份 —— ECharts 自动 0.4s 缓动补间，看起来像「绘制中」
- 帧录制：用 `canvas.toDataURL()` 抓每帧 PNG，提示用 ffmpeg 合成 GIF（README 也写了命令）

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
    title: { text: `截至 ${curYear} 年`, left: 'center',
      textStyle: { color: '#cbd5e1' } },
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

### 11.4 分享链接 + DOI 校验（`server/index.js` + `src/views/Crawl.vue`）

**设计要点**：

- 后端统一返回结构 `{ ok: true, data }` / `{ ok: false, error }`，前端按此分流
- DOI 校验分两道：前端 `/^10\.\d{4,9}\/\S+$/i`（格式）+ 后端非空判断（必填）
- 分享链接用短随机 ID（8 位 base36），命中自动跳 `/manage?{query}` 复现搜索

```javascript
// server/index.js（节选）
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

## 十二、心路历程与收获

### 12.1 心路历程

最初接到作业时我对「人机结对」是半信半疑的 —— 既想体验最新 AI 协作开发，又担心「AI 写出来我看不懂」或「代码质量不可控」。实际做下来，几个关键转折点：

1. **从「让 AI 写」到「让 AI 起草」**：第一轮我把整个项目甩给 AI，结果发现它一次性给出的方案要么过于复杂（用 Pinia + Vuex + Redux 三件套），要么过度工程化（webpack 配置写了 200 行）。我迅速收敛到「先给我一个最小可跑的脚手架，细节我自己补」的工作模式。

2. **算法调优要靠领域知识**：关键词抽取的停用词、TopN 排序的「热度 = 词频 × 年增长率」、共现图的 `minCo` 阈值——AI 能写出函数，但阈值参数它不知道该取多少。这部分必须人工拍板，AI 在 prompt 里提供默认值供参考。

3. **踩坑最有价值**：SQLite 选型那个坑（better-sqlite3 → node:sqlite）原本是可以"绕过去"的——直接换更老的 Node 版本。但我选择"今天踩了今天修"，因为这个坑暴露了「依赖二进制兼容性」的可移植性问题，比悄悄绕过去更能让我学到东西。AI 提供的 3 个选项也直接帮了我。

4. **动图播放器的设计最体现"协作"**：AI 给的初版是 GIF 后端生成方案（重、慢、不实时），我换成前端 ECharts 帧动画 + frameIndex 控制。这个方案是 AI 没主动提的，但它给的相关代码（setInterval + canvas.toDataURL）帮我节省了 30 分钟。

5. **DOI 字段的最后冲刺**：本来第一版只做了 title+venue+year，作业里 PROBLEM §4 评分点鼓励"DOI 必填"类的字段设计。在迭代过程中加上后，系统的学术可引用性大大增强——卡片头部紫色 DOI badge、详情页独立 DOI 段落、前端实时校验、后端强制校验，形成完整闭环。

### 12.2 收获

1. **工程化思维**：从"功能堆叠"升级到"接口契约 + 状态管理 + 错误兜底"的三件套
2. **AI 协作节奏**：分清"AI 强项"（模板代码、文档、选型对比）和"AI 弱项"（领域知识、阈值拍板、可读性）
3. **可移植性意识**：每个原生依赖都问一下"换个环境还能跑吗"——这次选 node:sqlite 就是这个问题的答案
4. **可视化思维**：不是图表越多越好，而是"一个图表解决一个核心问题"

---

## 十三、对 AI 结对伙伴的评价

### 13.1 优势

- ✅ **覆盖面广**：从 NABCD 头脑风暴到 SQLite 选型到 ECharts 配置，能跨多个领域给建议
- ✅ **多选项对比**：给方案时通常 2~3 个备选 + 各自优劣，比单纯给一个答案更让人能判断
- ✅ **代码片段可直接 copy**：语法、命名、边界条件都相对扎实，省去查文档时间
- ✅ **文档撰写**：README、博客、commit message 写得相当可读，省下大量文字工作

### 13.2 局限

- ⚠️ **领域知识依赖**：CV 三会的统计口径、CiteSpace 的输出格式、停用词表等，需要人类先有概念，AI 才能填充代码
- ⚠️ **过度生成倾向**：AI 会写出"应该需要的"逻辑，但其实当前不需要 —— 我必须自己裁剪
- ⚠️ **没法跑代码验证**：它给的方案不一定真能跑，必须自己 npm install + build + 启动验证
- ⚠️ **盲采的安全隐患**：如果不过 review 直接 commit，半年后看就是"这段代码谁写的？"—— 我坚持 review 后才采纳

### 13.3 改进建议（对未来的 AI 结对）

- 在「需求理解」阶段，AI 应主动询问「当前用户最痛的点」而非一次给完整方案
- 在「编码」阶段，遇到选型问题（如本作业的 DB 库），AI 应主动列出「每个方案的兼容性 / 维护性 / 学习成本」三维评分，而非只列优缺点

### 13.4 一句话总结

> AI 是「高质量的初级工程师」，能帮你写 80% 的代码，但剩下的 20%（选型、领域知识、可读性、踩坑）必须由人来做决定。这次作业让我更确信：**人机协作不是替代，而是杠杆** —— 杠杆放在「AI 起草 + 人 review」这个支点上，效率最高。

---

> **附：交付物清单**
>
> - ✅ CodeArts 仓库（main + dev 分支，v1.0.0 / v1.0.1 tag）
> - ✅ README.md + codestyle.md
> - ✅ 5 + 2 功能完整实现
> - ✅ 部署到华为云 ECS（Node 24 + 单端口 :3000）
> - ✅ 19+ 个语义化 commit + dev 分支合并
> - ✅ 博客（含 PSP / NABCD / 4 个代表性案例 / 4 段关键代码解读）
> - ✅ DOI 必填校验（前端 + 后端 + 老库迁移）