// /pitch/simple — the digital version of the canonical simple deck.
// Renders the SAME pixel-perfect slides the PDF is made from (the PNGs written
// by scripts/render-deck.mjs), with keyboard navigation, fullscreen and
// presenter notes from the deck plan. Edit slides-source.html + re-render;
// this page picks the new slides up automatically. HTML is the deck; the PDF
// is just the export.

import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { DECK_PLAN } from '@/lib/data/pitch-cockpit';
import { SimpleDeckClient } from './simple-deck-client';

export const metadata: Metadata = {
  title: 'Goods on Country — the simple deck',
  description: 'From waste to ownership. Community-designed health hardware, made from local plastic.',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

export default function SimpleDeckPage() {
  const dir = path.join(process.cwd(), 'public', 'deck-slides');
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /^goods-slide-\d{2}-.*\.png$/.test(f)).sort();
  } catch {
    files = [];
  }
  const slides = files.map((f) => {
    const n = Number(f.slice(12, 14));
    const plan = DECK_PLAN.find((s) => s.n === n);
    return { n, src: `/deck-slides/${f}`, name: plan?.name ?? f, talkTrack: plan?.talkTrack ?? '' };
  });
  return <SimpleDeckClient slides={slides} />;
}
