import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Crumb = { label: string; href?: string }

export function InsidersBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-stone-500">
      <Link href="/insiders" className="hover:text-[#C45C3E]">
        Insiders
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#C45C3E]">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-stone-900">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
