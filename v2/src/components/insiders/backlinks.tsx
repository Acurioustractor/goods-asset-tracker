import Link from 'next/link'
import { ArrowUpLeft } from 'lucide-react'
import type { WikiBacklink } from '@/lib/wiki/types'
import { insidersHref } from '@/lib/wiki/href'

export function InsidersBacklinks({ backlinks }: { backlinks: WikiBacklink[] }) {
  if (backlinks.length === 0) return null

  return (
    <section className="mt-16 border-t border-stone-200 pt-8">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
        <ArrowUpLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Referenced by
      </h2>
      <ul className="mt-4 space-y-2">
        {backlinks.map((bl) => (
          <li key={bl.fromSlugPath}>
            <Link
              href={insidersHref(bl.fromSlugPath)}
              className="text-sm text-stone-700 hover:text-[#C45C3E] transition-colors"
            >
              {bl.fromTitle}
            </Link>
            <span className="ml-2 text-xs text-stone-400">/{bl.fromSlugPath}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
