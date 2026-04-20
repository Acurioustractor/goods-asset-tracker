'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight, Home, BookOpen } from 'lucide-react'
import type { WikiTreeNode } from '@/lib/wiki/types'
import { cn } from '@/lib/utils'

type Props = {
  tree: WikiTreeNode[]
  currentSlug: string | null
}

export function InsidersSidebar({ tree, currentSlug }: Props) {
  return (
    <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0 border-r border-stone-200/70 bg-stone-50/40">
      <div className="sticky top-0 max-h-screen overflow-y-auto">
        <div className="px-5 py-6 border-b border-stone-200/70">
          <Link
            href="/insiders"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900 hover:text-[#C45C3E]"
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.5} />
            Insiders Wiki
          </Link>
          <p className="mt-1 text-xs text-stone-500 leading-relaxed">
            Goods on Country · QBE Catalysing Impact
          </p>
        </div>
        <nav className="p-3">
          <Link
            href="/insiders"
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 transition-colors',
              currentSlug === null && 'bg-stone-100 text-stone-900 font-medium'
            )}
          >
            <Home className="h-3.5 w-3.5" strokeWidth={1.5} />
            Home
          </Link>
          <div className="mt-4 space-y-1">
            {tree.map((node) => (
              <TreeNode key={node.slugPath} node={node} currentSlug={currentSlug} depth={0} />
            ))}
          </div>
        </nav>
      </div>
    </aside>
  )
}

function TreeNode({
  node,
  currentSlug,
  depth,
}: {
  node: WikiTreeNode
  currentSlug: string | null
  depth: number
}) {
  const pathname = usePathname()
  const isCurrent = currentSlug === node.slugPath
  const hasActiveChild =
    node.kind === 'folder' && node.children?.some((c) => c.slugPath === currentSlug)
  const [open, setOpen] = useState(depth === 0 ? hasActiveChild || isCurrent : true)

  if (node.kind === 'article') {
    return (
      <Link
        href={`/insiders/${node.slugPath}`}
        className={cn(
          'block rounded-md px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors',
          depth > 0 && 'ml-4',
          isCurrent && 'bg-[#C45C3E]/10 text-[#C45C3E] font-medium'
        )}
      >
        {node.label}
      </Link>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
          hasActiveChild ? 'text-[#C45C3E]' : 'text-stone-500 hover:text-stone-900'
        )}
      >
        <ChevronRight
          className={cn('h-3 w-3 transition-transform', open && 'rotate-90')}
          strokeWidth={2}
        />
        {node.label}
      </button>
      {open && node.children && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.slugPath}
              node={child}
              currentSlug={currentSlug}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
