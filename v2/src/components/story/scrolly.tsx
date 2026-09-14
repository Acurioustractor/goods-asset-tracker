'use client';

/**
 * Scrollytelling primitive: a graphic that stays put while the steps beside it scroll by. The
 * step nearest the middle of the window is the active one, and the graphic is re-rendered with
 * that index. No animation library; an IntersectionObserver and CSS transitions carry it, so the
 * server render is the first step with the graphic in its first state.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './scrolly.module.css';

export interface ScrollyStep {
  id: string;
  body: ReactNode;
}

export function Scrolly({ steps, graphic }: { steps: ScrollyStep[]; graphic: (active: number) => ReactNode }) {
  const [active, setActive] = useState(0);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter((el): el is HTMLLIElement => el !== null);
    if (items.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.step);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      // A band across the middle of the window: a step is active while it crosses it.
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  return (
    <div className={styles.scrolly}>
      <div className={styles.graphic}>
        <div className={styles.graphicInner}>{graphic(active)}</div>
      </div>
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li
            key={step.id}
            data-step={i}
            data-active={i === active}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className={styles.step}
          >
            <div className={styles.stepBody}>{step.body}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Scales a fixed-size child to fit its box, both ways, never above 1:1. */
export function FitBox({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / w, el.clientHeight / h));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div ref={ref} className={styles.fit}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'center center', flex: 'none' }}>{children}</div>
    </div>
  );
}
