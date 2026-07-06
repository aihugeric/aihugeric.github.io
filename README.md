# 哈格AI — aihug.cn

> 哈格相伴，智享未来 — 拥抱人工智能，书写诗意人生

基于 **VitePress** 构建的个人博客，托管于 **GitLab Pages**，支持自动同步到**微信公众号**。

**域名**: [aihug.cn](https://aihug.cn)

## 📁 项目结构

```
personal-blog/
├── .gitlab-ci.yml              # GitLab CI/CD 流水线
├── package.json
├── README.md
├── docs/                       # VitePress 文档根目录
│   ├── .vitepress/
│   │   ├── config.mts          # 站点配置
│   │   └── theme/              # 自定义主题
│   │       ├── index.ts        # 主题入口
│   │       ├── Layout.vue      # 自定义布局
│   │       └── style.css       # 样式表
│   ├── public/
│   │   └── logo.svg            # 站点 Logo
│   ├── index.md                # 首页
│   ├── archive.md              # 文章归档
│   ├── tech/                   # 技术文章
│   │   ├── index.md            # 文章列表
│   │   └── *.md                # 技术文章
│   └── poetry/                 # 诗词作品
│       ├── index.md            # 作品列表
│       └── *.md                # 诗词作品
└── scripts/
    └── sync-wechat.js          # 微信公众号同步脚本
```

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

### 部署到 GitLab

1. 将项目推送到 GitLab 仓库
2. GitLab CI/CD 会自动构建并部署到 GitLab Pages
3. 访问 `https://<username>.gitlab.io/<repo-name>`

需要在 GitLab 项目 **Settings → CI/CD → Variables** 中配置环境变量（见下文）。

## 🔗 微信公众号打通

### 工作原理

```
写文章(Markdown) → Git Push → GitLab CI 自动构建
                                    ↓
                           部署到 GitLab Pages
                                    ↓
                          sync-wechat Job 检测新增文章
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

#### 3. 配置 GitLab CI 变量

在 GitLab 项目 **Settings → CI/CD → Variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `WECHAT_APPID` | `wx1234567890abcdef` | 公众号 AppID |
| `WECHAT_APPSECRET` | `your_app_secret` | 公众号 AppSecret（**Masked**） |
| `WECHAT_SYNC_ENABLED` | `true` | 启用微信同步 |
| `BLOG_BASE_URL` | `https://blog.example.com` | （可选）博客访问地址，用于生成"阅读原文"链接 |

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

- 仅同步 `docs/tech/*.md` 和 `docs/poetry/*.md` 下的文章
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
category: tech       # tech 或 poetry
tags: [VitePress, 博客]
excerpt: 文章摘要，会同步到微信公众号的摘要字段
---

# 文章标题

正文内容...
```

### 发布流程

```bash
# 1. 创建新文章
vim docs/tech/my-new-post.md

# 2. 本地预览
npm run dev

# 3. 提交并推送
git add docs/tech/my-new-post.md
git commit -m "post: 新增文章《My New Post》"
git push origin main

# 4. 等待 GitLab CI 自动完成：
#    - 构建静态站点
#    - 部署到 Pages
#    - 同步到微信公众号草稿箱

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
