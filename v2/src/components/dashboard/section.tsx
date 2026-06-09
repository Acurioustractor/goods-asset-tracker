import type { ReactNode } from 'react';
import { ConfidenceChip, type ConfidenceGrade } from './confidence-chip';

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';

/**
 * One dashboard section. Owns the anchor id (required, so the scrollspy and hash
 * links work), the scroll offset under the sticky header, and a sticky header
 * band that carries the section's confidence grade where it has one.
 *
 * Measurement sections should pass `confidence`. Narrative sections (the goal,
 * the voice) legitimately do not, and pass a `posture` word instead.
 */
export function Section({
  id,
  eyebrow,
  title,
  confidence,
  posture,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  confidence?: { grade: ConfidenceGrade; note?: string };
  /** For narrative sections that carry no metric, e.g. "Direction, not measurement". */
  posture?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-12 first:pt-4">
      <header
        className="sticky top-[60px] z-10 -mx-4 mb-6 px-4 py-2.5 backdrop-blur sm:top-16"
        style={{ backgroundColor: `${CREAM}f2`, borderBottom: '1px solid #E8DED4' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>{eyebrow}</p>
            <h2 className="font-display text-2xl leading-tight sm:text-[1.75rem]" style={{ color: CHARCOAL }}>{title}</h2>
          </div>
          {confidence ? (
            <ConfidenceChip grade={confidence.grade} note={confidence.note} />
          ) : posture ? (
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: `${CHARCOAL}80` }}>{posture}</span>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}
