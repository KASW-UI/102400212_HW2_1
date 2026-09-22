# CV Paper Trend · CV 三会论文分析平台

> 与 AI 结对完成：基于 CVPR / ICCV / ECCV 近年论文，提供爬取、管理、Top10、关键词图谱、热度走势五项基础能力。

## ✨ 核心能力

| 功能 | 路径 | 说明 |
| --- | --- | --- |
| ① 论文爬取 / 导入 | `/crawl` | 单个输入 + 批量导入（粘贴 / .txt / .json），自动本地命中 → DBLP → 合成兜底 |
| ② 论文列表管理 | `/manage` | 增删改查；模糊查询未命中时一键联网爬取并入库 |
| ③ Top10 热门方向 | `/top10` | 关键词频次排行 + 三会雷达对比 + 关键词明细 |
| ④ 关键词图谱 | `/graph` | ECharts 力导向图，节点=关键词，边=共现，点击下钻相关论文 |
| ⑤ 热度走势对比 | `/trend` | 多年 × 多会议 × 多关键词的动图（播放 + 帧录制） |
| 附加 1：年度热词演变 | `/top10` 内 | 多年折线图 |
| 附加 2：了解更多 | `/about` | 介绍 CV 三会、统计口径、技术栈 |

## 🧱 技术栈

- **前端**：Vue 3 · Vite · Pinia · Vue Router · ECharts 5 · vue-echarts
- **后端**：Node.js 18+ · Express 4 · better-sqlite3（嵌入式 SQLite，符合作业建议）
- **部署**：单端口同时服务 API + 前端静态资源；华为云 ECS / CodeArts 一键启动

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 开发模式（前后端热重载）
npm run dev
# → 前端 http://localhost:5173  ·  API  http://localhost:3000/api/health

# 生产模式
npm run build        # 生成前端到 dist/
npm start           # 同时服务静态 + API，监听 :3000
```

第一次启动会自动写入约 30 篇 CV 三会种子数据到 `server/data.db`。

## ☁️ 部署到华为云

### A. 部署到华为云 ECS（最直接）

```bash
# 1) ssh 到 ECS（已安装 Node 18+）
git clone <你的仓库地址> cv-paper-platform
cd cv-paper-platform
npm install
npm run build
PORT=3000 nohup node server/index.js > app.log 2>&1 &
```

安全组放开 3000 端口，访问 `http://<ECS公网IP>:3000/` 即可。

### B. 部署到 CodeArts（流水线）

1. 仓库 → 「设置」→「基本信息」创建项目。
2. 「构建&发布」→「编译构建」选择 Node.js 模板，命令：
   ```bash
   npm ci
   npm run build
   ```
3. 「部署」→ 选择「主机部署」/「容器部署」，把 `dist/` 与 `server/` 同步到目标主机，运行 `node server/index.js`。

### C. 反向代理（Nginx 可选）

```nginx
server {
  listen 80;
  server_name your.domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 🗂️ 目录结构

```
cv-paper-platform/
├── server/                # 后端
│   ├── index.js           # Express 入口 + 路由
│   ├── db.js              # SQLite 持久化
│   ├── seed.js            # CV 种子论文
│   ├── crawler.js         # DBLP 爬取 + 合成兜底
│   └── keywords.js        # 分词 / TF / 共现
├── src/                   # 前端
│   ├── App.vue
│   ├── main.js
│   ├── router/index.js
│   ├── components/
│   │   ├── NavBar.vue
│   │   └── PaperCard.vue
│   ├── views/
│   │   ├── Home.vue       # 总览
│   │   ├── Crawl.vue      # 功能 1
│   │   ├── Manage.vue     # 功能 2
│   │   ├── Top10.vue      # 功能 3 + 附加 1
│   │   ├── Graph.vue      # 功能 4
│   │   ├── Trend.vue      # 功能 5
│   │   ├── PaperDetail.vue
│   │   ├── About.vue      # 附加 2
│   │   └── Share.vue      # 分享链接接收
│   ├── store/papers.js    # Pinia store
│   ├── services/api.js    # 后端 API 客户端
│   └── styles/main.css
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── package.json
├── codestyle.md
└── README.md
```

## 📊 数据来源 & 统计口径

- **种子数据**：基于 CVPR / ICCV / ECCV 公开接收论文清单整理，仅用于教学演示。
- **真实爬取**：通过 [DBLP](https://dblp.org/) 公开 API 实时拉取标题、作者、年份。
- **关键词统计**：英文按非字母数字拆分 + 中文 2~3 字 ngram；过滤通用停用词与领域弱信号词。
- **热度定义**：词频 × (1 + 年增长率)。
- **共现定义**：同一篇论文中两个关键词共同出现的次数。

详见 `/about` 页。

## 🤖 AI 结对说明

本项目在「Mavis」AI 结对下完成。AI 主要参与：

- 需求拆解与 NABCD 头脑风暴
- 算法迭代（关键词权重 / 共现阈值）
- 代码补全与重构
- 部署脚本与文档撰写

代表性案例与完整 prompt / AI 输出记录详见博客。

## 📜 脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 前后端并行热重载 |
| `npm run build` | 构建前端到 `dist/` |
| `npm start` | 生产模式启动 |
| `npm run lint` | ESLint 检查（可选） |

## 🪪 License

仅用于课程教学。数据版权归原作者与会议所有。