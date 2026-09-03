'use client';

/**
 * The living FAQ. Every entry from `qbe-faq.ts` as a disclosure with its own anchor, its status,
 * who asks it and where the answer comes from. Filter to the open ones to see what still needs a
 * person. To add a question, add an entry to the module; this list never holds text of its own.
 */
import { useState } from 'react';
import { FAQ, FAQ_OPEN_COUNT, type FaqEntry } from '@/lib/data/qbe-faq';
import { STORY_CHAPTERS } from '@/lib/data/qbe-story';

const statusStyle: Record<FaqEntry['status'], string> = {
  answered: 'bg-[#DDE2D2] text-goods-ink',
  partly: 'bg-[#EDE5D8] text-goods-ink',
  open: 'border border-goods-terracotta text-goods-terracotta',
};

export function FaqList() {
  const [filter, setFilter] = useState<'all' | 'open'>('all');
  const entries = filter === 'all' ? FAQ : FAQ.filter((f) => f.status !== 'answered');
  const chapterLabel = (id: FaqEntry['chapter']) => STORY_CHAPTERS.find((c) => c.id === id)?.label ?? id;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {(
          [
            ['all', `All ${FAQ.length}`],
            ['open', `Still open ${FAQ_OPEN_COUNT}`],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
              filter === k ? 'border-goods-terracotta bg-goods-terracotta text-white' : 'border-goods-grid text-goods-ink hover:border-goods-terracotta'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 divide-y divide-goods-grid border-y border-goods-grid">
        {entries.map((f) => (
          <details key={f.id} id={`faq-${f.id}`} className="group scroll-mt-24 py-4" open={filter === 'open'}>
            <summary className="flex cursor-pointer list-none items-start gap-4">
              <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">{chapterLabel(f.chapter)}</span>
              <span className="goods-pitch-display flex-1 text-xl leading-snug md:text-2xl">{f.question}</span>
              <span className={`mt-1 shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${statusStyle[f.status]}`}>{f.status}</span>
            </summary>
            <div className="mt-4 grid gap-4 pl-0 md:grid-cols-[1fr_260px] md:pl-[calc(6ch+1rem)]">
              <p className="max-w-3xl text-base leading-7">{f.answer || 'No answer yet that Ben would say out loud.'}</p>
              <dl className="text-xs leading-5 text-goods-sub">
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em]">Asked by</dt>
                <dd>{f.askedBy}</dd>
                <dt className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em]">First logged</dt>
                <dd>{f.asked}</dd>
                <dt className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em]">Source</dt>
                <dd>{f.source}</dd>
                <dt className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em]">Link</dt>
                <dd>
                  <a href={`#faq-${f.id}`} className="underline decoration-goods-grid underline-offset-4 hover:decoration-goods-terracotta">
                    #faq-{f.id}
                  </a>
                </dd>
              </dl>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
