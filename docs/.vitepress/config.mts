import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '哈格AI',
  description: '哈格AI — 拥抱人工智能，书写诗意人生 | aihug.cn',
  base: '/',
  srcDir: '../content',
  
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '技术', link: '/tech/' },
      { text: '诗词', link: '/poetry/' },
      { text: '归档', link: '/archive' },
    ],

    sidebar: {
      '/tech/': [
        {
          text: '技术文章',
          items: [
            { text: '全部文章', link: '/tech/' },
          ]
        }
      ],
      '/poetry/': [
        {
          text: '诗词作品',
          items: [
            { text: '全部作品', link: '/poetry/' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://gitlab.com' }
    ],

    footer: {
      message: '拥抱AI，智享未来 · aihug.cn',
      copyright: `Copyright © ${new Date().getFullYear()} 哈格AI · Powered by VitePress`
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文章',
            buttonAriaLabel: '搜索文章'
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭',
            noResultsText: '没有找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            }
          }
        }
      }
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },

  lastUpdated: true
})
