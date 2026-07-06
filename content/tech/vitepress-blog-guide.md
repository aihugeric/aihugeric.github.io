---
title: 用 VitePress 搭建个人博客
date: 2026-07-06
author: ericxi
category: tech
tags: [VitePress, 静态站点, 博客, GitLab Pages]
excerpt: 从零开始，一步步搭建基于 VitePress 的静态博客站点，并部署到 GitLab Pages。
---

# 用 VitePress 搭建个人博客

## 为什么选择 VitePress

[VitePress](https://vitepress.dev) 是 Vue 团队出品的静态站点生成器，基于 Vite 构建，拥有以下优势：

- **极快的开发体验**：Vite 驱动的 HMR，修改即时生效
- **出色的性能**：静态 HTML 生成，首屏加载极快
- **Markdown 优先**：支持 Vue 组件嵌入 Markdown
- **内置搜索**：本地全文搜索，无需第三方服务
- **主题可定制**：基于 Vue 3，可自由扩展

## 快速开始

### 1. 创建项目

```bash
mkdir my-blog && cd my-blog
npm init -y
npm install -D vitepress vue
```

### 2. 初始化文档

```bash
npx vitepress init
```

按照提示选择配置项，VitePress 会自动生成基础文件结构。

### 3. 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts      # 站点配置
│   └── theme/          # 自定义主题
│       ├── index.ts
│       ├── Layout.vue
│       └── style.css
├── index.md            # 首页
├── tech/               # 技术文章
│   └── index.md
└── poetry/             # 诗词作品
    └── index.md
```

### 4. 启动开发服务器

```bash
npx vitepress dev docs
```

打开 `http://localhost:5173` 即可预览。

## 部署到 GitLab Pages

在项目根目录创建 `.gitlab-ci.yml`：

```yaml
pages:
  stage: deploy
  image: node:22
  script:
    - npm ci
    - npm run build
    - cp -r docs/.vitepress/dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

推送代码后，GitLab 会自动构建并部署到 Pages。

## 自定义主题

VitePress 支持覆盖默认主题，你可以创建自定义布局：

```ts
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout
}
```

## 小结

VitePress 是一个轻量、高效、可定制的静态站点方案。配合 GitLab Pages，可以实现零成本、高可用的个人博客托管。
