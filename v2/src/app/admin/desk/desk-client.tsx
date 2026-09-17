'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { OutreachTarget } from '@/lib/data/outreach-targets';
import type { SellerReadiness } from '@/lib/data/seller-readiness';

type Question = 'relationships' | 'legal-pathways' | 'readiness';

const QUESTIONS: { id: Question; label: string; sub: string }[] = [
  { id: 'relationships', label: 'Relationships', sub: 'who repeats, and why' },
  { id: 'legal-pathways', label: 'Legal pathways', sub: 'who can buy without a tender' },
  { id: 'readiness', label: 'Readiness', sub: 'who has said yes to selling' },
];

const REPEAT_IDS = new Set(['centrecorp-foundation', 'julalikari-council']);

function statusColor(status: string) {
  if (/overdue|unpaid/i.test(status)) return 'text-[#C45C3E]';
  return 'text-[#8B9D77]';
}

function qualifyColor(q: SellerReadiness['qualifies']) {
  if (q === 'no') return 'text-[#C45C3E]';
  if (q === 'maybe') return 'text-[#BBA255]';
  return 'text-[#8B9D77]';
}

export function DeskClient({ buyers, readiness }: { buyers: OutreachTarget[]; readiness: SellerReadiness[] }) {
  const [question, setQuestion] = useState<Question>('relationships');

  return (
    <div className="flex min-h-screen bg-[#FBF8F1]">
      <aside className="w-[244px] shrink-0 border-r border-[#E6DFD1] p-[22px_18px] flex flex-col gap-[22px]">
        <div>
          <p className="text-[10px] font-bold tracking-wide text-[#C45C3E]">GOODS ON COUNTRY</p>
          <p className="font-serif text-xl text-[#2B2A26]">The Desk</p>
        </div>
        <div>
          <p className="px-2 pb-2 text-[9px] font-bold tracking-wide text-[#7A7363]">THE THREE QUESTIONS</p>
          <nav className="flex flex-col gap-0.5">
            {QUESTIONS.map(q => (
              <button
                key={q.id}
                onClick={() => setQuestion(q.id)}
                className={`text-left rounded-md px-2 py-1.5 ${question === q.id ? 'bg-[#F1ECE4]' : ''}`}
              >
                <p className="text-xs font-semibold text-[#2B2A26]">{q.label}</p>
                <p className="text-[9px] text-[#7A7363]">{q.sub}</p>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto text-[10px] text-[#7A7363]">
          <Link href="/admin/funding-board" className="underline">
            Full funding board ↗
          </Link>
          <br />
          <Link href="/admin/procurement" className="underline">
            Full procurement desk ↗
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-7 max-w-5xl">
        {question === 'relationships' && <Relationships buyers={buyers} />}
        {question === 'legal-pathways' && <LegalPathways />}
        {question === 'readiness' && <Readiness readiness={readiness} />}
      </main>
    </div>
  );
}

function Relationships({ buyers }: { buyers: OutreachTarget[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-[#C45C3E]">ADMIN · INTERNAL</p>
        <h1 className="font-serif text-3xl text-[#2B2A26]">Relationships</h1>
        <p className="mt-1 text-sm text-[#7A7363]">
          Who actually buys, who comes back, and why. Beds sell on trust with someone already spending in that community, not on a channel.
        </p>
      </div>

      <div className="rounded-xl bg-[#F1ECE4] p-4">
        <p className="text-[9px] font-bold tracking-wide text-[#7A7363]">THE ONLY TWO REPEAT BUYERS</p>
        <p className="mt-1.5 text-sm text-[#2B2A26] leading-snug">
          Centrecorp Foundation and Julalikari Council both came back for a second order. Everyone else bought once. The
          pattern that scales is a trusted relationship with someone already spending in that community, not a channel or a rule.
        </p>
      </div>

      <div className="rounded-xl bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F1ECE4]">
            <tr>
              {['Buyer', 'Bought', 'Status', 'Repeat?'].map(h => (
                <th key={h} className="p-2.5 text-[10px] font-bold tracking-wide text-[#7A7363]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buyers.map(b => (
              <tr key={b.id} className="border-t border-[#E6DFD1]">
                <td className="p-2.5 font-semibold text-[#2B2A26]">{b.name}</td>
                <td className="p-2.5 text-[#2B2A26]">{b.amountSignal}</td>
                <td className={`p-2.5 ${statusColor(b.amountSignal ?? '')}`}>{b.status}</td>
                <td className="p-2.5 font-bold text-[#A8643F]">{REPEAT_IDS.has(b.id) ? 'Yes' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LegalPathways() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-[#C45C3E]">ADMIN · INTERNAL</p>
        <h1 className="font-serif text-3xl text-[#2B2A26]">Legal pathways</h1>
        <p className="mt-1 text-sm text-[#7A7363]">
          Who can buy a bed, who could sell one, where the need is, and what is open.
        </p>
      </div>
      <div className="rounded-xl bg-[#F1ECE4] p-4">
        <p className="text-[9px] font-bold tracking-wide text-[#7A7363]">THE THING THAT GOVERNS ALL OF THIS</p>
        <p className="mt-1.5 text-sm text-[#2B2A26] leading-snug">
          Every Indigenous procurement instrument tests the entity that sells, and orders are invoiced by A Curious Tractor
          Pty Ltd, which does not pass. The community organisations we work with do.
        </p>
      </div>
      <Link
        href="/admin/procurement"
        className="rounded-xl border border-[#E6DFD1] bg-white p-4 text-sm font-semibold text-[#A8643F] hover:bg-[#F1ECE4]"
      >
        Open the full jurisdiction-by-jurisdiction breakdown (NT, SA, WA, QLD) →
      </Link>
    </div>
  );
}

function Readiness({ readiness }: { readiness: SellerReadiness[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-[#C45C3E]">ADMIN · INTERNAL</p>
        <h1 className="font-serif text-3xl text-[#2B2A26]">Readiness</h1>
        <p className="mt-1 text-sm text-[#7A7363]">
          Every legal pathway needs a community organisation to sell. Nobody has been asked yet. This tracks who has, what
          they said, and what they need to actually do it.
        </p>
      </div>
      <div className="rounded-xl bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F1ECE4]">
            <tr>
              {['Organisation', 'Qualifies as seller', 'Asked?', 'What they need'].map(h => (
                <th key={h} className="p-2.5 text-[10px] font-bold tracking-wide text-[#7A7363]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {readiness.map(r => (
              <tr key={r.id} className="border-t border-[#E6DFD1] align-top">
                <td className="p-2.5 font-semibold text-[#2B2A26]">{r.organisation}</td>
                <td className={`p-2.5 text-xs ${qualifyColor(r.qualifies)}`}>{r.qualifiesNote}</td>
                <td className="p-2.5 text-xs text-[#7A7363]">{r.asked ? 'Yes' : 'Not asked'}</td>
                <td className="p-2.5 text-xs text-[#7A7363]">{r.whatTheyNeed || r.askedNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
