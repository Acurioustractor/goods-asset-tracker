'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ConfidenceDot, type ConfidenceGrade } from './confidence-chip';

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';

export type NavItem = { id: string; label: string; grade?: ConfidenceGrade };

/**
 * The long-scroll layout for the partner dashboard. One client leaf: it owns
 * which section is active and renders the orientation chrome (top progress bar,
 * sticky desktop rail with a confidence dot per section, mobile disclosure).
 * The server-rendered <Section> children pass straight through, so all the
 * data-heavy work stays in Server Components.
 *
 * No tabs: the page is one argument with a direction, and the rail keeps the
 * reader oriented without fragmenting the scroll.
 */
export function DashboardScroll({ sections, children }: { sections: NavItem[]; children: ReactNode }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const idKey = ids.join('|');
  const [active, setActive] = useState(ids[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scrollspy: one IntersectionObserver, pick the topmost section in the band.
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActive(topmost.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Top progress bar: mutate transform directly, no re-render churn.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const activeItem = sections.find((s) => s.id === active);

  return (
    <>
      {/* Top scroll-progress bar */}
      <div className="fixed inset-x-0 top-0 z-40 h-[3px]" style={{ backgroundColor: '#E8DED4' }} aria-hidden>
        <div ref={progressRef} className="h-full origin-left" style={{ backgroundColor: RUST, transform: 'scaleX(0)' }} />
      </div>

      {/* Mobile: sticky "On this page" disclosure */}
      <div className="lg:hidden sticky top-0 z-30 backdrop-blur" style={{ backgroundColor: `${CREAM}f2`, borderBottom: '1px solid #E8DED4' }}>
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium"
          style={{ color: CHARCOAL }}
        >
          <span className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide" style={{ color: `${CHARCOAL}80` }}>On this page</span>
            <span style={{ color: RUST }}>{activeItem?.label ?? sections[0]?.label}</span>
          </span>
          <span aria-hidden style={{ color: `${CHARCOAL}80`, transform: mobileOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>▾</span>
        </button>
        {mobileOpen ? (
          <nav aria-label="On this page" className="px-3 pb-3">
            <ul className="grid grid-cols-2 gap-1.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={s.id === active ? 'true' : undefined}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                    style={s.id === active ? { backgroundColor: '#FFFFFF', color: CHARCOAL, fontWeight: 600 } : { color: `${CHARCOAL}cc` }}
                  >
                    {s.grade ? <ConfidenceDot grade={s.grade} /> : <span className="inline-block h-2 w-2" aria-hidden />}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>

      {/* Grid: sticky desktop rail + scrolling content column */}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden self-start lg:block lg:sticky lg:top-24">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: `${CHARCOAL}80` }}>On this page</p>
          <ul className="space-y-0.5 border-l" style={{ borderColor: '#E8DED4' }}>
            {sections.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? 'true' : undefined}
                    className="-ml-px flex items-center gap-2.5 border-l-2 py-1.5 pl-3 text-sm transition"
                    style={
                      on
                        ? { borderColor: RUST, color: CHARCOAL, fontWeight: 600 }
                        : { borderColor: 'transparent', color: `${CHARCOAL}99` }
                    }
                  >
                    {s.grade ? <ConfidenceDot grade={s.grade} /> : <span className="inline-block h-2 w-2 shrink-0" aria-hidden />}
                    <span className="leading-snug">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
