import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  category: 'tech' | 'poetry'
  excerpt: string
  author?: string
  tags?: string[]
}

export default createContentLoader(['tech/*.md', 'poetry/*.md'], {
  includeSrc: false,
  excerpt: false,
  transform(raw): Post[] {
    return raw
      // 排除目录索引页本身
      .filter((page) => page.url !== '/tech/' && page.url !== '/poetry/')
      .map((page) => ({
        title: page.frontmatter.title || '',
        url: page.url,
        date: page.frontmatter.date || '',
        category: page.frontmatter.category || (page.url.startsWith('/tech/') ? 'tech' : 'poetry'),
        excerpt: page.frontmatter.excerpt || '',
        author: page.frontmatter.author,
        tags: page.frontmatter.tags || [],
      }))
      // 按日期倒序排列，最新的在前
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})

export { Post }
