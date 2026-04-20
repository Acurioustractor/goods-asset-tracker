import type { Metadata } from 'next'
import { getTree } from '@/lib/wiki/loader'
import { InsidersSidebar } from '@/components/insiders/sidebar'
import '../wiki.css'

export const metadata: Metadata = {
  title: 'Insiders — Goods on Country',
  description: 'Knowledge base for Goods on Country advisors, funders and program partners.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function InsidersLayout({ children }: { children: React.ReactNode }) {
  const tree = getTree()

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <div className="flex">
        <InsidersSidebar tree={tree} currentSlug={null} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
