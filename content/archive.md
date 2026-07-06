---
title: 文章归档
description: 所有文章按时间倒序排列
---

<script setup>
import { data as posts } from './posts.data'
</script>

# 📦 文章归档

所有文章按时间倒序排列。

---

<ul>
  <li v-for="p in posts" :key="p.url" style="line-height: 2;">
    <code style="font-size: 0.85em;">{{ p.date }}</code>
    &nbsp;
    <a :href="p.url">{{ p.title }}</a>
    &nbsp;
    <span style="font-size: 0.85em; color: var(--vp-c-text-3);">
      {{ p.category === 'tech' ? '💻 技术' : '📜 诗词' }}
    </span>
  </li>
</ul>
