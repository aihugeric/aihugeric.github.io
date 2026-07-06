---
title: 技术文章
description: 编程实践、架构设计、工具分享
---

<script setup>
import { data as posts } from '../posts.data'
const techPosts = posts.filter(p => p.category === 'tech')
</script>

# 💻 技术文章

记录编程实践、架构思考与工具探索。

---

### 📝 文章列表

<div v-for="p in techPosts" :key="p.url" style="margin-bottom: 1.5em;">
  <h4 style="margin-bottom: 0.15em;"><a :href="p.url">{{ p.title }}</a></h4>
  <small>{{ p.date }}</small>
  <p style="margin-top: 0.3em; color: var(--vp-c-text-2);">{{ p.excerpt }}</p>
</div>

---

> 持续更新中，欢迎关注。
