'use client';

/**
 * A number that counts from zero to its value the first time it scrolls into view, with its
 * claim label printed beside it, always. Reduced motion prints the final value at once. The
 * label is part of the number, never a tooltip: verified, estimate, modelled or target.
 */

import { useEffect, useRef, useState } from 'react';
import type { MeasureLabel } from '@/lib/data/pitch-chapters';

const LABEL_STYLE: Record<MeasureLabel, string> = {
  verified: 'border-[#5E7A4C] text-[#5E7A4C]',
  estimate: 'border-[#A8643F] text-[#A8643F]',
  modelled: 'border-[#7a7363] text-[#7a7363]',
  target: 'border-[#C45C3E] text-[#C45C3E]',
};

export function ClaimLabel({ label, dark = false }: { label: MeasureLabel; dark?: boolean }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${LABEL_STYLE[label]} ${dark ? 'bg-goods-cream/90' : ''}`}>
      {label}
    </span>
  );
}

export function CountUp({ value, unit, label, duration = 1400, className = '' }: { value: number; unit?: string; label?: MeasureLabel; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      setDone(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span ref={ref} className="tabular-nums" aria-live={done ? 'off' : 'polite'}>
        {shown.toLocaleString('en-AU')}
      </span>
      {unit && <span className="text-base font-normal opacity-70">{unit}</span>}
      {label && <ClaimLabel label={label} />}
    </span>
  );
}

/** Today against the year-one plan, as two bars that fill when seen. */
export function TodayPlanBars({ today, plan, todayLabel, planLabel, dark = false }: { today: number; plan: number; todayLabel: MeasureLabel; planLabel: MeasureLabel; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const max = Math.max(today, plan, 1);
  const pct = (n: number) => `${Math.min(100, Math.round((n / max) * 100))}%`;
  const track = dark ? 'bg-goods-cream/10' : 'bg-[#EDE5D8]';
  return (
    <div ref={ref} className="space-y-2" aria-hidden="true">
      <div className={`h-3 w-full overflow-hidden rounded-full ${track}`}>
        <div className="h-full rounded-full bg-goods-terracotta transition-[width] duration-[1200ms] ease-out" style={{ width: seen ? pct(today) : '0%' }} />
      </div>
      <div className={`h-3 w-full overflow-hidden rounded-full border border-goods-terracotta/60 ${track}`}>
        <div className="h-full rounded-full bg-goods-terracotta/25 transition-[width] duration-[1200ms] ease-out delay-200" style={{ width: seen ? pct(plan) : '0%' }} />
      </div>
      <p className="sr-only">
        Today {today} ({todayLabel}); year one plan {plan} ({planLabel}).
      </p>
    </div>
  );
}
