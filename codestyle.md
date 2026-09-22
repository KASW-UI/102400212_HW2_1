# 代码规范

> 来源：[Vue.js Style Guide (Official, v3)](https://vuejs.org/style-guide/) ·
> [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide/) ·
> [Express.js Best Practices](https://expressjs.com/en/advanced/best-practices-security.html) ·
> [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)（部分采纳）

本项目遵循以上主流规范并做了适度精简。规则分为 **必须**（lint 阻断）和 **建议**（code review）。

## 1. 文件与命名

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 组件文件名 | PascalCase | `PaperCard.vue` |
| 组合式 API | `<script setup>` 优先；setup 顶部 `defineProps` / `defineEmits` |  |
| 文件扩展名 | `.vue` / `.js` |  |
| 常量 | UPPER_SNAKE | `MAX_TOP_N` |
| 路由 | kebab-case path + camelCase name | `/crawl` → `name: 'crawl'` |
| 数据库表名 | snake_case 复数 | `papers`, `shares` |

## 2. JavaScript / Vue

- **必须** 使用 ES Modules（`import` / `export`），不使用 CommonJS。
- **必须** `const` 优先；`let` 仅在需要重赋值时使用；禁用 `var`。
- **必须** 字符串使用单引号或反引号，模板字符串用反引号。
- **必须** 函数参数 ≤ 4 个；超过用对象传入。
- **必须** 组件 `props` 显式声明类型；`emits` 显式声明。
- **必须** Vue 模板中保持简单；复杂逻辑抽到 `<script setup>`。
- **建议** 单一职责：每个组件 ≤ 250 行；超过则拆。

## 3. 缩进 / 排版

- 缩进：2 空格
- 行尾：无尾随空格；文件以一个空行结尾
- 单行 ≤ 100 字符（HTML 模板中可放宽到 120）
- 文件末尾保留单个换行

## 4. 注释

- 每个文件开头注明模块作用。
- 函数 / 导出 API 使用 JSDoc 简短说明（参数 / 返回）。
- 不要写显而易见的注释；只解释 **为什么**。

## 5. 后端（Express / Node）

- 路由路径全部小写，复数名词优先（`/api/papers`）。
- 返回结构统一：`{ ok: true, data }` / `{ ok: false, error }`。
- 异常处理：路由内 `try / catch`；错误通过 `next(err)` 走统一中间件。
- 数据库：使用 prepared statements（`db.prepare`）。
- 端口：通过 `process.env.PORT` 注入，默认 3000。

## 6. 提交（Git）

- Commit 信息格式：`type(scope): summary`，例如 `feat(crawl): support batch txt import`。
- 每次 commit 只做一件事，便于回滚与 review。
- 不提交：`node_modules/`、`dist/`、`*.db`、`*.log`（见 `.gitignore`）。

## 7. 安全

- 用户输入：写入数据库前校验；URL 通过 `<a target="_blank" rel="noopener">` 打开。
- 依赖：定期 `npm audit`；CI 可加 `npm audit --audit-level=high` 阻断。

## 8. 不要做

- ❌ 不要提交 `console.log` 调试代码（错误处理中的 console.error 除外）
- ❌ 不要在前端硬编码 API 地址（统一走相对路径 `/api`）
- ❌ 不要把密钥、token 写进代码

## 9. 推荐阅读

- Vue 风格指南：https://vuejs.org/style-guide/
- Google JS：https://google.github.io/styleguide/jsguide/
- Node 最佳实践：https://github.com/goldbergyoni/nodebestpractices

—— 本规范随项目演进；变更请通过 PR 并在博客中说明。