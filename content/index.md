---
layout: home
---

<script setup>
import { data as posts } from './posts.data'
</script>

<div class="hero-section">
  <h1>哈格AI</h1>
  <p class="subtitle">
    一半山川湖海，一半代码长歌。
  </p>
</div>

<div class="module-grid">
  <a href="/tech/" class="module-card module-card-tech">
    <span class="icon">💻</span>
    <h2>技术文章</h2>
    <p>
      编程实践、架构设计、工具分享。<br/>
      记录技术路上的思考与沉淀。
    </p>
    <span class="badge">浏览技术文章 →</span>
  </a>

  <a href="/poetry/" class="module-card module-card-poetry">
    <span class="icon">📜</span>
    <h2>诗词作品</h2>
    <p>
      古典诗词、现代诗歌。<br/>
      以文字之美，抒胸中之意。
    </p>
    <span class="badge">品读诗词作品 →</span>
  </a>
</div>

<div class="latest-section">
  <h2>📝 最近更新</h2>
  <ul class="article-list">
    <li v-for="p in posts" :key="p.url" class="article-item">
      <span class="tag" :class="p.category === 'tech' ? 'tag-tech' : 'tag-poetry'">{{ p.category === 'tech' ? '技术' : '诗词' }}</span>
      <h3><a :href="p.url">{{ p.title }}</a></h3>
      <span class="date">{{ p.date }}</span>
      <p class="excerpt">{{ p.excerpt }}</p>
    </li>
  </ul>
</div>
