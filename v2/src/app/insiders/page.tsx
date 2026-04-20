import Link from 'next/link'
import { getTree, getFolderLanding } from '@/lib/wiki/loader'
import { ArrowRight } from 'lucide-react'

const folderBlurbs: Record<string, string> = {
  program: 'QBE Catalysing Impact 2026 program structure, stages, dates, expectations.',
  capital: 'The 13 instruments, blended finance, catalytic capital, our stack.',
  investors: 'Funder profiles, alignment tool, pipeline state.',
  governance: 'Board, risk, legal structure, compliance, data sovereignty.',
  'support-network': 'Social Impact Hub, PIN, legal, advisory group, cohort peers.',
  impact: 'ALMA framework, theory of change, Empathy Ledger as impact infrastructure.',
  products: 'Stretch Bed, washing machines, containerised plant.',
  communities: 'PICC, Oonchiumpa, Tennant Creek, NPY and other deployment partners.',
  enterprise: 'Durable versions of the 10 QBE diagnostic topics.',
}

export default function InsidersHome() {
  const tree = getTree()
  const folders = tree.filter((t) => t.kind === 'folder')

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
      <div className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C45C3E]">
          Insiders
        </p>
        <h1 className="mt-4 text-4xl lg:text-5xl font-serif tracking-tight text-stone-900">
          Goods on Country — Wiki
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-stone-600 leading-relaxed font-serif">
          Living knowledge base for advisors, funders and program partners. Restructured
          April 2026 around the QBE Catalysing Impact program. 80+ articles across 9
          topic folders. Updated as we go.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => {
          const landing = getFolderLanding(folder.name)
          const description =
            folderBlurbs[folder.name] || landing?.summary || 'Topic cluster.'
          return (
            <Link
              key={folder.name}
              href={`/insiders/${folder.name}`}
              className="group block rounded-lg border border-stone-200 bg-white p-6 transition-all hover:border-[#C45C3E]/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-serif font-semibold text-stone-900">
                  {folder.label}
                </h2>
                <ArrowRight
                  className="h-4 w-4 text-stone-400 transition-all group-hover:text-[#C45C3E] group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {description}
              </p>
              {folder.children && (
                <p className="mt-4 text-xs uppercase tracking-wider text-stone-400">
                  {folder.children.length} {folder.children.length === 1 ? 'article' : 'articles'}
                </p>
              )}
            </Link>
          )
        })}
      </div>

      <footer className="mt-24 border-t border-stone-200 pt-8 text-xs text-stone-500">
        <p>
          Shared with you under advisor trust. Please do not forward the link or password.
          Last wiki restructure: 16 April 2026.
        </p>
      </footer>
    </div>
  )
}
