'use client';

/**
 * Chapter 17, the four gates, as one line that fills gate by gate when the chapter comes into
 * view. Each gate's marker lands as the line reaches it, its words rise, and the money line under
 * it says what money moves at that gate: sage when money moves, plain when none does. Across on
 * wide screens, down on phones. Reduced motion shows the line full and every gate at once.
 */

import { useInView } from '@/components/pitch/use-in-view';
import type { Gate } from '@/lib/data/pitch-chapters';

const FILL_MS = 2400;

export function GatesTimeline({ gates, footer }: { gates: readonly Gate[]; footer: string }) {
  const [ref, on] = useInView<HTMLOListElement>(0.3);
  const at = (i: number) => (gates.length === 1 ? 0 : (i / (gates.length - 1)) * FILL_MS);

  return (
    <div>
      <style>{`
        .gt-t{transition:opacity 600ms ease,transform 700ms cubic-bezier(.34,1.56,.64,1)}
        @media (prefers-reduced-motion: reduce){.gt-t,.gt-fill{transition:none!important}}
      `}</style>
      <ol ref={ref} className="relative mt-12 grid gap-10 pl-10 md:pl-0 lg:grid-cols-4 lg:gap-8">
        {/* The track and its fill: down on phones and tablets, across on wide screens. */}
        <span className="absolute bottom-2 left-[15px] top-2 w-0.5 rounded-full bg-[#E6DFD1] lg:hidden" aria-hidden="true" />
        <span className="gt-fill absolute left-[15px] top-2 w-0.5 rounded-full bg-[#A8643F] lg:hidden" style={{ height: on ? 'calc(100% - 1rem)' : '0%', transition: `height ${FILL_MS}ms cubic-bezier(.45,0,.2,1)` }} aria-hidden="true" />
        <span className="absolute left-4 top-4 hidden h-0.5 w-[calc(75%+1.5rem)] rounded-full bg-[#E6DFD1] lg:block" aria-hidden="true" />
        <span className="gt-fill absolute left-4 top-4 hidden h-0.5 rounded-full bg-[#A8643F] lg:block" style={{ width: on ? "calc(75% + 1.5rem)" : "0%", transition: `width ${FILL_MS}ms cubic-bezier(.45,0,.2,1)` }} aria-hidden="true" />

        {gates.map((g, i) => {
          const moves = /\$/.test(g.money);
          return (
            <li key={g.id} className="relative md:pl-10 lg:pl-0">
              <span
                className="gt-t absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#A8643F] bg-[#FDF8F3] font-display text-sm font-semibold text-[#A8643F] md:left-0 lg:static"
                style={{ opacity: on ? 1 : 0.3, transform: on ? 'scale(1)' : 'scale(.6)', transitionDelay: `${at(i)}ms` }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="gt-t lg:mt-5" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(16px)', transitionDelay: `${at(i) + 150}ms` }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A8643F]">Gate 0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">{g.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4a4741]">{g.detail}</p>
                <p className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${moves ? 'bg-[#E9EDE3] text-[#3f5634]' : 'bg-[#efe9dd] text-[#5d574c]'}`}>{g.money}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-10 max-w-3xl text-sm text-[#5d574c]">{footer}</p>
    </div>
  );
}
