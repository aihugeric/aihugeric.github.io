/**
 * sync-wechat.js
 * 
 * 微信公众号文章自动同步脚本
 * 
 * 功能：
 * 1. 检测 Git 提交中新增/修改的 Markdown 文章
 * 2. 解析文章 frontmatter 和内容
 * 3. 通过微信公众平台 API 创建/更新草稿
 * 
 * 环境变量（在 GitLab CI Variables 中配置）：
 *   WECHAT_APPID       - 微信公众号 AppID
 *   WECHAT_APPSECRET   - 微信公众号 AppSecret
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs')

// ============================================
// 配置
// ============================================
const WECHAT_APPID = process.env.WECHAT_APPID
const WECHAT_APPSECRET = process.env.WECHAT_APPSECRET
const WECHAT_API_BASE = 'https://api.weixin.qq.com/cgi-bin'

// 要同步的文章目录（相对于 docs/）
const CONTENT_DIRS = ['tech', 'poetry']

// 生成访问外网的博客地址（用于图文"阅读原文"链接）
const BLOG_BASE_URL = process.env.BLOG_BASE_URL || ''

// ============================================
// 工具函数
// ============================================

/**
 * 从 frontmatter 原始文本中解析字段
 */
function parseFrontmatter(rawText) {
  const result = {}
  const lines = rawText.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // 简单键值对: key: value
    const keyMatch = trimmed.match(/^(\w+):\s*(.+)$/)
    if (keyMatch) {
      const key = keyMatch[1]
      let value = keyMatch[2].trim()
      
      // 去掉引号
      value = value.replace(/^['"]|['"]$/g, '')
      
      // 数组格式: [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      }
      
      result[key] = value
    }
  }
  
  return result
}

/**
 * 解析 Markdown 文件，提取 frontmatter 和正文
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // 匹配 YAML frontmatter（--- 包裹）
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  
  if (!fmMatch) {
    return { frontmatter: {}, body: content }
  }
  
  const frontmatter = parseFrontmatter(fmMatch[1])
  const body = fmMatch[2].trim()
  
  return { frontmatter, body }
}

/**
 * Markdown 转 HTML（简化版，适合微信公众号）
 * 
 * 微信图文支持的 HTML 标签有限，主要支持：
 * h1-h6, p, a, img, ul, ol, li, blockquote, strong, em, br, hr
 * pre/code, table, span (部分样式)
 */
function markdownToWeChatHtml(md) {
  let html = md

  // 代码块（必须在其他处理之前）
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<pre style="background:#282c34;color:#abb2bf;padding:16px;border-radius:8px;overflow-x:auto;font-size:14px;line-height:1.6;font-family:Consolas,Monaco,monospace;"><code>${escaped}</code></pre>`
  })

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;color:#e74c3c;padding:2px 6px;border-radius:4px;font-family:Consolas,Monaco,monospace;font-size:0.9em;">$1</code>')

  // 标题
  html = html.replace(/^#### (.+)$/gm, '<h4 style="margin:20px 0 10px;font-size:16px;font-weight:600;">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 style="margin:24px 0 12px;font-size:18px;font-weight:600;">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 style="margin:28px 0 14px;font-size:20px;font-weight:700;border-bottom:2px solid #2563eb;padding-bottom:8px;">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 style="margin:32px 0 16px;font-size:24px;font-weight:800;text-align:center;">$1</h1>')

  // 分割线
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">')

  // 粗体和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2563eb;text-decoration:none;">$1</a>')

  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li style="margin:4px 0;">$1</li>')
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul style="padding-left:24px;margin:12px 0;">$1</ul>')

  // 有序列表
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li style="margin:4px 0;">$1</li>')

  // 引用块
  html = html.replace(/^>\s?(.+)$/gm, '<blockquote style="border-left:4px solid #8b5cf6;background:#faf5ff;padding:12px 16px;margin:16px 0;color:#555;">$1</blockquote>')

  // 普通段落（非标签行）
  html = html.replace(/^(?!<[hupolbdc]|<hr)(.+)$/gm, (_, text) => {
    if (text.trim() === '') return '<br/>'
    return `<p style="margin:12px 0;line-height:1.8;color:#333;">${text}</p>`
  })

  // 清理多余的换行
  html = html.replace(/\n{3,}/g, '\n\n')

  return html
}

/**
 * 微信公众号文章样式的 HTML 包装
 */
function wrapWeChatHtml(title, author, contentHtml, sourceUrl = '') {
  return `
<div style="max-width:680px;margin:0 auto;padding:16px 0;">
  <h1 style="text-align:center;font-size:22px;font-weight:800;margin-bottom:8px;color:#1a1a1a;">${title}</h1>
  <p style="text-align:center;font-size:14px;color:#999;margin-bottom:24px;">${author} · 个人博客</p>
  ${contentHtml}
  ${sourceUrl ? `
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:32px 0 16px;">
  <p style="text-align:center;font-size:13px;color:#999;">
    <a href="${sourceUrl}" style="color:#2563eb;">📖 阅读原文</a>
  </p>` : ''}
</div>`.trim()
}

// ============================================
// 微信 API
// ============================================

/**
 * 获取 access_token（带缓存）
 */
let cachedToken = null
let tokenExpiry = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const url = `${WECHAT_API_BASE}/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_APPSECRET}`
  
  const response = await fetch(url)
  const data = await response.json()

  if (data.errcode) {
    throw new Error(`获取 access_token 失败: [${data.errcode}] ${data.errmsg}`)
  }

  cachedToken = data.access_token
  // 提前 5 分钟过期
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000
  
  console.log(`   ✓ 获取 access_token 成功 (有效期: ${data.expires_in}s)`)
  return cachedToken
}

/**
 * 上传封面图（永久素材），返回 media_id
 * 
 * 微信要求图文必须有封面图。这里生成一个简单的纯色 SVG
 * 作为占位封面。你也可以替换为自己的封面图。
 */
async function uploadCoverImage(accessToken) {
  // 生成一个简单的纯色 SVG 作为占位封面
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="900" y2="500">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="900" height="500" fill="url(#bg)"/>
  <text x="450" y="220" text-anchor="middle" font-size="48" font-weight="bold" fill="white" font-family="sans-serif">技术 · 诗词</text>
  <text x="450" y="300" text-anchor="middle" font-size="24" fill="rgba(255,255,255,0.8)" font-family="sans-serif">个人博客</text>
</svg>`

  const svgBuffer = Buffer.from(svgContent, 'utf-8')

  // 微信上传永久素材接口
  const url = `${WECHAT_API_BASE}/material/add_material?access_token=${accessToken}&type=image`
  
  // 将 SVG 保存为临时文件
  const tmpDir = path.join(PROJECT_ROOT, 'tmp')
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }
  
  const tmpFile = path.join(tmpDir, 'cover.png')
  
  // 检查是否有 sharp 等图片处理库，没有则使用简单的占位方式
  // 这里直接上传 SVG（微信不支持SVG），所以需要转换为 PNG
  // 我们先尝试使用系统工具转换，如果没有则给出提示
  
  console.log('   ⚠ 封面图上传需要先将 SVG 转为 PNG')
  console.log('   提示：安装 sharp 库可自动转换: npm install sharp')
  
  // 如果没有图片处理能力，使用 fetch 上传一个默认图片
  // 或者直接返回 null，跳过封面图
  return null
}

/**
 * 创建微信图文草稿
 */
async function createDraft(accessToken, article) {
  const url = `${WECHAT_API_BASE}/draft/add?access_token=${accessToken}`
  
  const body = {
    articles: [{
      title: article.title,
      author: article.author || 'ericxi',
      digest: article.excerpt || '',
      content: article.content,
      content_source_url: article.sourceUrl || '',
      thumb_media_id: article.thumbMediaId || '',
      need_open_comment: 0,
      only_fans_can_comment: 0,
    }]
  }

  // 如果没有封面图，尝试不传 thumb_media_id（可能某些公众号允许）
  if (!article.thumbMediaId) {
    // 微信要求必须有封面图，但我们先尝试
    // 实际使用时应该在素材库预先上传好一个默认封面图
    console.log('   ⚠ 未提供封面图，尝试创建无封面草稿...')
    // 先尝试不带 thumb_media_id
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const data = await response.json()
  
  if (data.errcode) {
    throw new Error(`创建草稿失败: [${data.errcode}] ${data.errmsg}`)
  }
  
  return data.media_id
}

// ============================================
// Git 变更检测
// ============================================

/**
 * 获取本次提交中变更的 Markdown 文件列表
 */
function getChangedMarkdownFiles() {
  try {
    // 在 CI 中，比较 HEAD 和 HEAD~1
    const diffOutput = execSync(
      'git diff --name-only --diff-filter=AM HEAD~1 HEAD',
      { encoding: 'utf-8', cwd: PROJECT_ROOT }
    ).trim()

    if (!diffOutput) {
      console.log('没有检测到文件变更')
      return []
    }

    const files = diffOutput.split('\n').filter(f => {
      // 只处理 docs/ 下的 .md 文件（排除 index.md 等列表页）
      return f.startsWith('docs/') && 
             f.endsWith('.md') && 
             !f.endsWith('/index.md') &&
             !f.startsWith('docs/index.md') &&
             !f.startsWith('docs/archive.md')
    })

    console.log(`检测到 ${files.length} 个文章文件变更:`)
    files.forEach(f => console.log(`   - ${f}`))
    
    return files
  } catch (err) {
    console.error('Git 变更检测失败:', err.message)
    return []
  }
}

// ============================================
// 主流程
// ============================================

async function main() {
  console.log('='.repeat(50))
  console.log('📡 微信公众号文章同步')
  console.log('='.repeat(50))
  console.log()

  // 1. 检查配置
  if (!WECHAT_APPID || !WECHAT_APPSECRET) {
    console.log('❌ 未配置 WECHAT_APPID 或 WECHAT_APPSECRET，跳过同步')
    console.log('   请在 GitLab CI Variables 中设置这两个环境变量')
    process.exit(0)
  }

  // 2. 检测变更文件
  const changedFiles = getChangedMarkdownFiles()
  
  if (changedFiles.length === 0) {
    console.log('ℹ️  没有检测到需要同步的文章变更')
    process.exit(0)
  }

  // 3. 获取 access_token
  console.log('\n📋 步骤 1: 获取 access_token...')
  let accessToken
  try {
    accessToken = await getAccessToken()
  } catch (err) {
    console.error(`❌ ${err.message}`)
    process.exit(1)
  }

  // 4. 处理每篇文章
  console.log('\n📋 步骤 2: 同步文章...')
  
  let successCount = 0
  let failCount = 0

  for (const filePath of changedFiles) {
    const fullPath = path.join(PROJECT_ROOT, filePath)
    const fileName = path.basename(filePath, '.md')
    
    console.log(`\n   处理: ${filePath}`)
    
    try {
      // 检查文件是否存在
      if (!fs.existsSync(fullPath)) {
        console.log(`   ⚠ 文件不存在，跳过`)
        continue
      }

      // 解析文章
      const { frontmatter, body } = parseMarkdownFile(fullPath)
      
      if (!frontmatter.title) {
        console.log(`   ⚠ 缺少 title，跳过`)
        continue
      }

      // 生成微信 HTML
      const contentHtml = markdownToWeChatHtml(body)
      
      // 构建原文链接
      const relativeUrl = filePath.replace('docs/', '').replace('.md', '.html')
      const sourceUrl = BLOG_BASE_URL ? `${BLOG_BASE_URL}/${relativeUrl}` : ''

      // 包装完整 HTML
      const wrappedHtml = wrapWeChatHtml(
        frontmatter.title,
        frontmatter.author || 'ericxi',
        contentHtml,
        sourceUrl
      )

      // 创建草稿
      const article = {
        title: frontmatter.title,
        author: frontmatter.author || 'ericxi',
        excerpt: frontmatter.excerpt || frontmatter.description || '',
        content: wrappedHtml,
        sourceUrl,
        thumbMediaId: null
      }

      console.log(`   标题: ${article.title}`)
      console.log(`   摘要: ${article.excerpt || '(无)'}`)
      
      try {
        const mediaId = await createDraft(accessToken, article)
        console.log(`   ✅ 同步成功！草稿 ID: ${mediaId}`)
        successCount++
      } catch (err) {
        // 如果是缺少封面图的错误，给出建议
        if (err.message.includes('thumb') || err.message.includes('封面')) {
          console.log(`   ⚠ ${err.message}`)
          console.log('   💡 提示：请在微信公众平台素材库预先上传封面图，')
          console.log('      然后在脚本中配置默认封面图的 media_id')
        } else {
          console.log(`   ❌ ${err.message}`)
        }
        failCount++
      }

    } catch (err) {
      console.error(`   ❌ 处理失败: ${err.message}`)
      failCount++
    }
  }

  // 5. 总结
  console.log()
  console.log('='.repeat(50))
  console.log(`📊 同步完成: 成功 ${successCount} 篇, 失败 ${failCount} 篇`)
  console.log('='.repeat(50))
  console.log()
  console.log('💡 提示：')
  console.log('   1. 同步的是微信"草稿"，需要在公众号后台手动发布')
  console.log('   2. 可以在 GitLab CI Variables 中设置 BLOG_BASE_URL')
  console.log('      来启用"阅读原文"链接功能')
  console.log('   3. 首次使用建议先在后台配置默认封面图')

  if (failCount > 0) {
    process.exit(1)
  }
}

// 运行
main().catch(err => {
  console.error('❌ 未预期错误:', err)
  process.exit(1)
})
