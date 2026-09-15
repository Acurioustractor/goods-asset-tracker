'use client';

/**
 * The model placemat, composed: head, the raise, the four panels, the trade (ModelLoop), the
 * support band. Words, figures, stations and panels live in @/lib/data/model-placemat. The loop is
 * the same drawing the story scrolls through, so there is one model, not two.
 */

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { PANELS, RAISE, SHEET, SHEET_H, SHEET_W, dollars } from '@/lib/data/model-placemat';
import { ModelLoop } from './model-loop';
import styles from './model-placemat.module.css';

/** The sheet at 1:1, 1588 by 1123 px. Wrap in ModelPlacematFrame to fit a screen. */
export function ModelPlacemat() {
  return (
    <div className={styles.sheet} data-placemat="whole">
      <header className={styles.head}>
        <h1 className={styles.title}>{SHEET.title}</h1>
        <p className={styles.subtitle}>{SHEET.subtitle}</p>
      </header>

      <section className={styles.raise} aria-label="The raise">
        <h2 className={styles.raiseHeading}>
          {SHEET.raiseHeading}
          {SHEET.raiseNote ? <span className={styles.raiseNote}>· {SHEET.raiseNote}</span> : null}
        </h2>
        <div className={styles.raisePills}>
          <div className={`${styles.pill} ${styles.pillQbe}`}>
            <h3>QBE {dollars(RAISE.qbeAud)}</h3>
            <p>{RAISE.qbeFor}</p>
          </div>
          <div className={styles.plus} aria-hidden="true">
            +
          </div>
          <div className={`${styles.pill} ${styles.pillOther}`}>
            <h3>Beds {dollars(RAISE.bedsShownAud)}</h3>
            <p>{RAISE.bedsFor}</p>
          </div>
          <div className={styles.plus} aria-hidden="true">
            +
          </div>
          <div className={`${styles.pill} ${styles.pillQbe}`}>
            <h3>Loan {dollars(RAISE.loanAud)}</h3>
            <p>{RAISE.loanFor}</p>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <aside className={styles.panels} aria-label="Employment and recycling">
          {PANELS.filter((p) => p.id === 'employment' || p.id === 'recycling').map((p) => (
            <PanelCard key={p.id} panel={p} />
          ))}
        </aside>

        <ModelLoop />

        <aside className={styles.panels} aria-label="Enterprise and health">
          {PANELS.filter((p) => p.id === 'enterprise' || p.id === 'health').map((p) => (
            <PanelCard key={p.id} panel={p} />
          ))}
        </aside>
      </div>

      <section className={styles.band} aria-label={SHEET.support.title}>
        <span className={styles.bandTitle}>{SHEET.support.title}</span>
        <span className={styles.bandItems}>
          {SHEET.support.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
      </section>

      {SHEET.footer ? <p className={styles.footer}>{SHEET.footer}</p> : null}
    </div>
  );
}

export function PanelCard({ panel }: { panel: (typeof PANELS)[number] }) {
  return (
    <div className={styles.panel} data-panel={panel.id}>
      <div className={styles.panelPhoto}>
        <Image src={panel.photo.src} alt={panel.photo.alt} fill unoptimized sizes="236px" style={{ objectFit: 'cover' }} />
      </div>
      <div className={styles.panelText}>
        <h3>{panel.title}</h3>
        <p>{panel.line}</p>
      </div>
    </div>
  );
}

/** Scales the sheet to the width it is given, never above 1:1. */
export function ModelPlacematFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / SHEET_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={frameRef} style={{ width: '100%', height: Math.round(SHEET_H * scale) }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: SHEET_W, height: SHEET_H }}>
        <ModelPlacemat />
      </div>
    </div>
  );
}
