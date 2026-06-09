/**
 * Confidence chip — the reusable trust primitive for the partner dashboard.
 *
 * Three grades, deliberately fewer than the underlying ImpactMetric scale, so a
 * reader learns one vocabulary and sees it on every number:
 *   COUNTED   we counted it (asset register, Xero-reconciled)
 *   MODELLED  a stated assumption (e.g. ~20kg plastic per bed, ~2.5 people per bed)
 *   NOT YET   named honestly, we do not measure this yet
 *
 * `grade` is REQUIRED on purpose. There is no default, so a metric can never
 * silently render as the wrong confidence (see redesign critique P1-4).
 */

export type ConfidenceGrade = 'counted' | 'modelled' | 'not-yet';

type GradeMeta = { label: string; dot: string; bg: string; fg: string; border: string };

const GRADE_META: Record<ConfidenceGrade, GradeMeta> = {
  counted: { label: 'Counted', dot: '#8B9D77', bg: '#E6EDDD', fg: '#4F6138', border: '#CBD8BA' },
  modelled: { label: 'Modelled', dot: '#C98A3C', bg: '#F3E6D2', fg: '#8A6433', border: '#E4CBA1' },
  'not-yet': { label: 'Not yet measured', dot: '#B8AEA4', bg: '#EEE9E3', fg: '#6A5E54', border: '#D8CFC4' },
};

/** Map the code's ImpactMetric.confidence scale onto the three reader-facing grades. */
export function gradeFromMetric(c: 'verified' | 'modelled' | 'estimate' | 'target'): ConfidenceGrade {
  if (c === 'verified') return 'counted';
  if (c === 'modelled' || c === 'estimate') return 'modelled';
  return 'not-yet';
}

export function ConfidenceChip({
  grade,
  note,
  className = '',
}: {
  grade: ConfidenceGrade;
  /** One sentence: the largest source of uncertainty, or what we would need to be sure. */
  note?: string;
  className?: string;
}) {
  const m = GRADE_META[grade];
  return (
    <span
      title={note}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}
      style={{ backgroundColor: m.bg, color: m.fg, border: `1px solid ${m.border}` }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.dot }} aria-hidden />
      {m.label}
    </span>
  );
}

/** Small dot used in the scrollspy rail to show each section's epistemic posture. */
export function ConfidenceDot({ grade, className = '' }: { grade: ConfidenceGrade; className?: string }) {
  const m = GRADE_META[grade];
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${className}`}
      style={{ backgroundColor: m.dot, border: grade === 'not-yet' ? `1px solid ${m.fg}55` : 'none' }}
      aria-hidden
    />
  );
}

/** Defined once near the hero; the legend the rest of the page leans on. */
export function ConfidenceLegend() {
  const CHARCOAL = '#2E2E2E';
  const items: { grade: ConfidenceGrade; desc: string }[] = [
    { grade: 'counted', desc: 'We counted it. Asset register and Xero-reconciled figures.' },
    { grade: 'modelled', desc: 'A stated assumption, labelled. Like plastic diverted or people reached.' },
    { grade: 'not-yet', desc: 'We name it honestly. We do not measure this yet.' },
  ];
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
      {items.map((it) => (
        <div key={it.grade} className="flex items-start gap-2">
          <ConfidenceChip grade={it.grade} />
          <span className="text-xs leading-snug" style={{ color: `${CHARCOAL}99`, maxWidth: '20rem' }}>{it.desc}</span>
        </div>
      ))}
    </div>
  );
}
