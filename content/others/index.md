---
title: 其他作品
description: ericxi 的其他创作，故事与随笔
---

<script setup>
import { data as posts } from '../posts.data'
const others = posts.filter(p => p.category === 'others')
</script>

# 📂 其他作品

故事、随笔，以及其他未归类的文字。

---

### 🗂️ 作品列表

<div v-for="p in others" :key="p.url" style="margin-bottom: 1.5em;">
  <h4 style="margin-bottom: 0.15em;"><a :href="p.url">{{ p.title }}</a></h4>
  <small>{{ p.date }}</small>
  <p style="margin-top: 0.3em; color: var(--vp-c-text-2);">{{ p.excerpt }}</p>
</div>

---

> 生活不止代码与诗，还有烟火人间。
