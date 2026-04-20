import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { WikiArticle, WikiBacklink, WikiTreeNode } from './types'

const DEV_WIKI_ROOT = path.resolve(process.cwd(), '..', 'wiki', 'articles')
const PROD_WIKI_ROOT = path.resolve(process.cwd(), '.wiki-content')

function resolveWikiRoot(): string {
  if (fs.existsSync(DEV_WIKI_ROOT)) return DEV_WIKI_ROOT
  if (fs.existsSync(PROD_WIKI_ROOT)) return PROD_WIKI_ROOT
  throw new Error(
    `Wiki content not found. Expected at ${DEV_WIKI_ROOT} (dev) or ${PROD_WIKI_ROOT} (prod). Run "npm run wiki:sync" before building.`
  )
}

function walkMarkdown(root: string, dir: string = root): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkMarkdown(root, full))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

function filepathToSlug(root: string, filepath: string): string[] {
  const rel = path.relative(root, filepath).replace(/\\/g, '/')
  const parts = rel.replace(/\.md$/i, '').split('/')
  return parts
}

function slugPath(slug: string[]): string {
  return slug.join('/')
}

function humanize(raw: string): string {
  return raw
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function extractTitle(body: string, fallback: string): string {
  const match = body.match(/^\s*#\s+(.+?)\s*$/m)
  if (match) return match[1].trim()
  return humanize(fallback)
}

function extractSummary(body: string): string | null {
  const match = body.match(/^\s*>\s+(.+(?:\n>.+)*)/m)
  if (!match) return null
  return match[1]
    .split('\n')
    .map((line) => line.replace(/^>\s?/, '').trim())
    .join(' ')
    .trim()
}

function stripHeading(body: string): string {
  let out = body.replace(/^\s*#\s+.+\n+/, '')
  out = out.replace(/^\s*>\s+.+(?:\n>\s*.+)*\n*/m, '')
  return out.trim()
}

let cache: {
  articles: WikiArticle[]
  bySlugPath: Map<string, WikiArticle>
  tree: WikiTreeNode[]
  backlinks: Map<string, WikiBacklink[]>
} | null = null

function buildCache() {
  const root = resolveWikiRoot()
  const files = walkMarkdown(root)
  const articles: WikiArticle[] = []

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8')
    const { data, content } = matter(raw)
    const slug = filepathToSlug(root, file)
    const sp = slugPath(slug)
    const title = extractTitle(content, slug[slug.length - 1])
    const summary = extractSummary(content)
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const folder = slug.length > 1 ? slug[0] : null

    articles.push({
      slug,
      slugPath: sp,
      title,
      summary,
      folder,
      filepath: file,
      frontmatter: data as WikiArticle['frontmatter'],
      body: stripHeading(content),
      wordCount,
    })
  }

  const bySlugPath = new Map(articles.map((a) => [a.slugPath, a]))

  // Build tree
  const tree = buildTree(articles)

  // Build backlinks by scanning [[wikilinks]] in every article body
  const backlinks = new Map<string, WikiBacklink[]>()
  const linkPattern = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g
  for (const article of articles) {
    const seen = new Set<string>()
    let match: RegExpExecArray | null
    while ((match = linkPattern.exec(article.body)) !== null) {
      const target = resolveWikiLink(match[1].trim(), article.slug, bySlugPath)
      if (!target || seen.has(target)) continue
      seen.add(target)
      if (!backlinks.has(target)) backlinks.set(target, [])
      backlinks.get(target)!.push({
        fromSlugPath: article.slugPath,
        fromTitle: article.title,
      })
    }
  }

  cache = { articles, bySlugPath, tree, backlinks }
  return cache
}

function buildTree(articles: WikiArticle[]): WikiTreeNode[] {
  const root: WikiTreeNode[] = []
  const folderNodes = new Map<string, WikiTreeNode>()

  // Group articles by top-level folder; root-level articles are rendered at top.
  const sorted = [...articles].sort((a, b) => a.slugPath.localeCompare(b.slugPath))

  for (const article of sorted) {
    // Skip hidden-from-tree files
    if (article.frontmatter.publish === false) continue
    // Skip README files in sidebar; they render as folder landing
    if (article.slug[article.slug.length - 1] === 'README') continue
    // Skip hidden INDEX — we have our own homepage
    if (article.slug.length === 1 && article.slug[0] === 'INDEX') continue

    if (article.slug.length === 1) {
      root.push({
        kind: 'article',
        name: article.slug[0],
        label: article.title,
        slugPath: article.slugPath,
        description: article.summary || undefined,
      })
      continue
    }

    const folderName = article.slug[0]
    if (!folderNodes.has(folderName)) {
      const folderNode: WikiTreeNode = {
        kind: 'folder',
        name: folderName,
        label: humanize(folderName),
        slugPath: folderName,
        children: [],
      }
      folderNodes.set(folderName, folderNode)
      root.push(folderNode)
    }
    folderNodes.get(folderName)!.children!.push({
      kind: 'article',
      name: article.slug.slice(1).join('/'),
      label: article.title,
      slugPath: article.slugPath,
      description: article.summary || undefined,
    })
  }

  // Custom order for top-level folders (matches the wiki INDEX intent)
  const order = [
    'program',
    'capital',
    'impact',
    'governance',
    'investors',
    'support-network',
    'products',
    'communities',
    'enterprise',
  ]
  root.sort((a, b) => {
    const ai = order.indexOf(a.name)
    const bi = order.indexOf(b.name)
    if (ai === -1 && bi === -1) return a.label.localeCompare(b.label)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return root
}

export function resolveWikiLink(
  target: string,
  fromSlug: string[],
  bySlugPath: Map<string, WikiArticle>
): string | null {
  const clean = target.replace(/\.md$/i, '').trim()

  // Explicit path with slashes (e.g. "investors/sefa", "../capital/capital-stack")
  if (clean.includes('/')) {
    let parts = clean.split('/')
    // Handle relative upward traversal
    if (parts[0] === '..') {
      const fromFolder = fromSlug.slice(0, -1) // drop filename
      const rel = [...fromFolder]
      for (const p of parts) {
        if (p === '..') rel.pop()
        else rel.push(p)
      }
      parts = rel
    }
    const candidate = parts.join('/')
    if (bySlugPath.has(candidate)) return candidate
    // Try with README appended (for folder landing links)
    if (bySlugPath.has(`${candidate}/README`)) return `${candidate}/README`
    return null
  }

  // Bare slug: search in same folder first, then anywhere
  if (fromSlug.length > 1) {
    const sameFolder = [...fromSlug.slice(0, -1), clean].join('/')
    if (bySlugPath.has(sameFolder)) return sameFolder
  }

  // Global search by last-segment match
  for (const [sp] of bySlugPath) {
    const last = sp.split('/').pop()
    if (last === clean) return sp
  }
  return null
}

export function getAllArticles(): WikiArticle[] {
  if (!cache) buildCache()
  return cache!.articles
}

export function getArticle(slug: string[]): WikiArticle | null {
  if (!cache) buildCache()
  const sp = slug.join('/')
  return cache!.bySlugPath.get(sp) || null
}

export function getTree(): WikiTreeNode[] {
  if (!cache) buildCache()
  return cache!.tree
}

export function getBacklinks(slugPath: string): WikiBacklink[] {
  if (!cache) buildCache()
  return cache!.backlinks.get(slugPath) || []
}

export function getSlugMap(): Map<string, WikiArticle> {
  if (!cache) buildCache()
  return cache!.bySlugPath
}

export function getFolderLanding(folder: string): WikiArticle | null {
  if (!cache) buildCache()
  return cache!.bySlugPath.get(`${folder}/README`) || null
}

export function getFolderChildren(folder: string): WikiArticle[] {
  if (!cache) buildCache()
  return cache!.articles.filter(
    (a) =>
      a.slug.length === 2 &&
      a.slug[0] === folder &&
      a.slug[1] !== 'README' &&
      a.frontmatter.publish !== false
  )
}
