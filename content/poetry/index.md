---
title: 诗词作品
description: ericxi诗词创作合集，古典诗词与现代诗歌
---

<script setup>
import { data as posts } from '../posts.data'
const poems = posts.filter(p => p.category === 'poetry')
</script>

# 📜 诗词作品

以文字之美，抒胸中之意。

---

### 🖋️ 作品列表

<div v-for="p in poems" :key="p.url" style="margin-bottom: 1.5em;">
  <h4 style="margin-bottom: 0.15em;"><a :href="p.url">{{ p.title }}</a></h4>
  <small>{{ p.date }}</small>
  <p style="margin-top: 0.3em; color: var(--vp-c-text-2);">{{ p.excerpt }}</p>
</div>

---

> 以诗会友，以词寄情。
