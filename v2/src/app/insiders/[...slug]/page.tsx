import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getArticle,
  getBacklinks,
  getFolderChildren,
  getFolderLanding,
  getSlugMap,
  getTree,
} from '@/lib/wiki/loader'
import { preprocessWikilinks } from '@/lib/wiki/wikilinks'
import { ArticleRenderer } from '@/components/insiders/article-renderer'
import { InsidersBreadcrumbs } from '@/components/insiders/breadcrumbs'
import { InsidersBacklinks } from '@/components/insiders/backlinks'
import { ArrowRight } from 'lucide-react'

type Params = { slug: string[] }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const article = getArticle(slug) || getArticle([...slug, 'README'])
  if (!article) return { title: 'Not found — Insiders' }
  return {
    title: `${article.title} — Insiders`,
    description: article.summary || undefined,
    robots: { index: false, follow: false },
  }
}

export default async function InsidersArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  // Direct article hit
  let article = getArticle(slug)

  // Folder landing: user navigated to /insiders/<folder> — try README
  let isFolderLanding = false
  if (!article) {
    const asFolder = getArticle([...slug, 'README'])
    if (asFolder) {
      article = asFolder
      isFolderLanding = true
    }
  }

  if (!article) notFound()
  if (article.frontmatter.publish === false) notFound()

  const slugMap = getSlugMap()
  const processed = preprocessWikilinks(article.body, article.slug, slugMap)

  // Build breadcrumbs
  const crumbs: { label: string; href?: string }[] = []
  for (let i = 0; i < article.slug.length; i++) {
    const seg = article.slug[i]
    if (seg === 'README') continue
    const isLast = i === article.slug.length - 1
    const href = '/insiders/' + article.slug.slice(0, i + 1).join('/')
    const tree = getTree()
    const folderMatch = tree.find((t) => t.name === seg)
    crumbs.push({
      label: folderMatch?.label || humanize(seg),
      href: isLast ? undefined : href,
    })
  }

  // For folder landings, list child articles
  const folderChildren = isFolderLanding ? getFolderChildren(article.slug[0]) : []

  const backlinks = getBacklinks(article.slugPath)

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 lg:py-16">
      <InsidersBreadcrumbs crumbs={crumbs} />

      <header className="mt-6 mb-10">
        {article.frontmatter.type && (
          <p className="text-xs uppercase tracking-[0.18em] text-[#8B9D77] font-semibold">
            {article.frontmatter.type}
          </p>
        )}
        <h1 className="mt-3 text-3xl lg:text-4xl font-serif tracking-tight text-stone-900">
          {article.title}
        </h1>
        {article.summary && (
          <p className="mt-4 text-lg text-stone-600 leading-relaxed font-serif italic">
            {article.summary}
          </p>
        )}
      </header>

      <ArticleRenderer>{processed}</ArticleRenderer>

      {isFolderLanding && folderChildren.length > 0 && (
        <section className="mt-12 border-t border-stone-200 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Articles in this topic
          </h2>
          <div className="mt-4 grid gap-3">
            {folderChildren.map((child) => (
              <Link
                key={child.slugPath}
                href={`/insiders/${child.slugPath}`}
                className="group flex items-start justify-between gap-4 rounded-md border border-stone-200 bg-white p-4 transition-all hover:border-[#C45C3E]/40"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    {child.title}
                  </h3>
                  {child.summary && (
                    <p className="mt-1 text-sm text-stone-600 line-clamp-2">{child.summary}</p>
                  )}
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-stone-400 transition-all group-hover:text-[#C45C3E] group-hover:translate-x-0.5 mt-1"
                  strokeWidth={1.5}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      <InsidersBacklinks backlinks={backlinks} />
    </div>
  )
}

function humanize(s: string): string {
  return s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
