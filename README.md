# 哈格AI — 个人博客

> 哈格相伴，智享未来 — 拥抱人工智能，书写诗意人生

基于 **VitePress** 构建的个人博客，部署于 **腾讯云 EdgeOne Pages**，支持自动同步到**微信公众号**。

**线上地址**: EdgeOne Pages 部署后自动分配

## 📁 项目结构

```
aihugeric.github.io/
├── .github/workflows/
│   ├── deploy-edgeone.yml      # EdgeOne Pages 部署（CLI 备用，手动触发）
│   └── deploy.yml              # GitHub Pages 部署（备用，commit 含"部署"时触发）
├── .gitlab-ci.yml              # GitLab CI/CD 流水线（历史遗留）
├── edgeone.json                # EdgeOne Git 集成构建配置
├── package.json
├── README.md
├── docs/                       # VitePress 站点根目录（构建入口）
│   ├── .vitepress/
│   │   ├── config.mts          # 站点配置（srcDir 指向 ../content）
│   │   └── theme/              # 自定义主题
│   │       ├── index.ts        # 主题入口
│   │       ├── Layout.vue       # 自定义布局
│   │       └── style.css        # 样式表
│   └── public/
│       └── logo_rm.png          # 站点 Logo
├── content/                    # 文章源码目录（srcDir）
│   ├── posts.data.ts           # 文章数据加载器（createContentLoader）
│   ├── index.md                # 首页
│   ├── archive.md              # 文章归档
│   ├── tech/                   # 技术文章
│   │   ├── index.md            # 文章列表
│   │   └── *.md                # 技术文章
│   └── poetry/                 # 诗词作品
│       ├── index.md            # 作品列表
│       └── *.md                # 诗词作品
│   └── others/                 # 其他作品（故事、随笔等）
│       ├── index.md            # 作品列表
│       └── *.md                # 其他分类作品
└── scripts/
    └── sync-wechat.js          # 微信公众号同步脚本
```

> 说明：`docs/` 是 VitePress 的构建根目录（`vitepress build docs`），真正的文章内容放在 `content/`（`srcDir: '../content'`）。部署产物输出到 `docs/.vitepress/dist`。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建静态站点
npm run build

# 预览构建结果
npm run preview
```

### 部署到 EdgeOne Pages（主要）

项目部署到腾讯云 **EdgeOne Pages**，构建配置见仓库根目录 `edgeone.json`：

| 配置项 | 值 |
|--------|-----|
| 安装命令 | `npm install` |
| 构建命令 | `npx vitepress build docs` |
| 输出目录 | `docs/.vitepress/dist` |
| Node 版本 | `22.11.0` |

#### 方式一：EdgeOne 控制台 Git 集成（主要，推荐）

1. 在 [EdgeOne Makers 控制台](https://console.cloud.tencent.com/edgeone/pages) 选择「导入 Git 仓库」
2. 授权并选择 `aihugeric/aihugeric.github.io` 仓库
3. 按上表填写构建配置（也可直接读取 `edgeone.json`）
4. 点击「开始部署」，后续 push 到 `main` 自动触发重建

> 加速区域在项目创建时选定、创建后不可修改。如需**免备案**绑定自定义域名，请确保选了「全球可用区（不含中国大陆）」。

#### 方式二：GitHub Actions + EdgeOne CLI（备用）

工作流文件：`.github/workflows/deploy-edgeone.yml`（手动触发 `workflow_dispatch`）。

**前置配置**：在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加 `EDGEONE_API_TOKEN`（EdgeOne 控制台 Settings → API Tokens 生成）。手动 Run workflow 后，流程为：安装依赖 → 构建 → 安装 EdgeOne CLI → `edgeone makers deploy` 上传 `docs/.vitepress/dist`。

### 部署到 GitHub Pages（备用）

工作流文件：`.github/workflows/deploy.yml`。

触发条件：在 Actions 页面手动 Run workflow，**或** 提交信息包含「部署」二字时自动触发。需在 GitHub Settings → Pages → Source 选择 "GitHub Actions"。

### 部署到 GitLab Pages（历史遗留）

`.gitlab-ci.yml` 为早期方案，当前主流程已迁移至 EdgeOne Pages，一般无需使用。

## 🔗 微信公众号打通

### 工作原理

```
写文章(Markdown) → Git Push → 本地/CI 构建部署
                                    ↓
                          运行 node scripts/sync-wechat.js
                                    ↓
                         检测 content/tech、content/poetry 下新增/修改文章
                                    ↓
                       调用微信 API 创建图文草稿
                                    ↓
                      在公众号后台手动预览 → 发布
```

### 配置步骤

#### 1. 获取微信公众号开发者凭证

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入 **设置与开发 → 基本配置**
3. 获取 **AppID** 和 **AppSecret**（需要管理员扫码）

> ⚠️ **注意**：需要**已认证**的微信公众号（服务号或订阅号均可）

#### 2. 配置 IP 白名单

在微信公众平台 **基本配置** 中，将 GitLab Runner 的出口 IP 加入 IP 白名单。

> 提示：可以在 sync-wechat 的 CI Job 中运行 `curl ifconfig.me` 获取 Runner 出口 IP。

#### 3. 配置运行环境变量

在本地终端或 CI 环境变量中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `WECHAT_APPID` | `wx1234567890abcdef` | 公众号 AppID |
| `WECHAT_APPSECRET` | `your_app_secret` | 公众号 AppSecret（**勿提交到仓库**） |
| `BLOG_BASE_URL` | `https://blog.example.com` | （可选）博客访问地址，用于生成"阅读原文"链接 |

> 同步脚本读取上述变量（见 `scripts/sync-wechat.js` 顶部），本地执行 `npm run sync:wechat` 即可；CI 中通过对应平台的 Secrets/Variables 注入。

#### 4. 上传默认封面图（重要）

微信图文**必须**有封面图。建议：

1. 设计一张 900×500 的封面图
2. 在微信公众平台 **素材管理** 中上传为永久素材
3. 获取该素材的 `media_id`
4. 在 `scripts/sync-wechat.js` 中配置默认封面图的 `media_id`

```javascript
// 在 scripts/sync-wechat.js 中修改 createDraft 函数：
const DEFAULT_COVER_MEDIA_ID = 'your_permanent_media_id_here'
```

### 同步范围

脚本会自动检测 Git 提交中 **新增或修改** 的文章文件：

- 仅同步 `content/tech/` 和 `content/poetry/` 下的文章（`CONTENT_DIRS` 配置，相对于 `docs/`）
- 列表页（`index.md`）和归档页不会被同步
- 只处理最近一次提交中的变更

## ✍️ 写文章

### 文章格式

每篇文章需要在开头包含 YAML frontmatter：

```markdown
---
title: 文章标题
date: 2026-07-06
author: ericxi
category: tech       # tech / poetry / others
tags: [VitePress, 博客]
excerpt: 文章摘要，会同步到微信公众号的摘要字段
---

# 文章标题

正文内容...
```

### 发布流程

```bash
# 1. 创建新文章（内容放在 content/ 下对应分类目录）
vim content/tech/my-new-post.md

# 2. 本地预览
npm run dev

# 3. 提交并推送
git add content/tech/my-new-post.md
git commit -m "post: 新增文章《My New Post》"
git push origin main

# 4. EdgeOne Git 集成自动完成构建与部署；如需同步公众号：
npm run sync:wechat

# 5. 登录公众号后台，预览并发布草稿
```

## 🎨 自定义

### 修改主题色

编辑 `docs/.vitepress/theme/style.css`：

```css
:root {
  --vp-c-tech: #2563eb;     /* 技术模块主色 */
  --vp-c-poetry: #8b5cf6;   /* 诗词模块主色 */
}
```

### 添加新模块

1. 在 `docs/` 下创建新目录（如 `life/`）
2. 在 `docs/.vitepress/config.mts` 的 `nav` 中添加导航项
3. 在 `sidebar` 中添加侧边栏配置
4. 在 `scripts/sync-wechat.js` 的 `CONTENT_DIRS` 中注册新目录

### 修改同步行为

编辑 `scripts/sync-wechat.js`：

- `CONTENT_DIRS`: 要同步的文章目录
- `markdownToWeChatHtml()`: Markdown 到微信 HTML 的转换规则
- `wrapWeChatHtml()`: 微信图文的 HTML 模板

## 📝 License

MIT
