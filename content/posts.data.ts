import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  category: 'tech' | 'poetry' | 'others'
  excerpt: string
  author?: string
  tags?: string[]
}

export default createContentLoader(['tech/*.md', 'poetry/*.md', 'others/*.md'], {
  includeSrc: false,
  excerpt: false,
  transform(raw): Post[] {
    return raw
      // 排除目录索引页本身
      .filter((page) => page.url !== '/tech/' && page.url !== '/poetry/' && page.url !== '/others/')
      .map((page) => ({
        title: page.frontmatter.title || '',
        url: page.url,
        date: page.frontmatter.date || '',
        category: page.frontmatter.category ||
          (page.url.startsWith('/tech/') ? 'tech' : page.url.startsWith('/others/') ? 'others' : 'poetry'),
        excerpt: page.frontmatter.excerpt || '',
        author: page.frontmatter.author,
        tags: page.frontmatter.tags || [],
      }))
      // 按日期倒序排列，最新的在前
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})

export { Post }
