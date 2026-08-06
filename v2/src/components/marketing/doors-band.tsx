import Link from 'next/link';
import { HOME_DOORS } from '@/lib/data/home';

/**
 * The end-of-page doors band (2026-08-06). Every supporter surface was ending with
 * no next action at all — someone finished the story page moved, and got the footer.
 * This closes /story, /stories, /gallery and /storytellers with the SAME four doors
 * the homepage ends on (home.ts HOME_DOORS, guarded), so the last thing a reader
 * sees is always their next step. Ink text on the light tones for AA contrast.
 */
const TONE_STYLES: Record<string, { bg: string; text: string }> = {
  terracotta: { bg: 'var(--goods-terracotta)', text: '#FFFFFF' },
  sage: { bg: 'var(--goods-sage)', text: 'var(--goods-ink)' },
  teal: { bg: 'var(--goods-teal)', text: '#FFFFFF' },
  gold: { bg: 'var(--goods-gold)', text: 'var(--goods-ink)' },
};

export function DoorsBand() {
  return (
    <section className="border-t border-goods-grid bg-goods-cream-muted py-14 md:py-16">
      <div className="container mx-auto px-4">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-goods-sub">
          Where to from here?
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_DOORS.map((door) => {
            const tone = TONE_STYLES[door.tone];
            return (
              <Link
                key={door.title}
                href={door.cta.href}
                className="rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: tone.bg, color: tone.text }}
              >
                <p className="font-display text-xl font-semibold">{door.title}</p>
                <p className="mt-1 text-sm opacity-80">{door.cta.label} →</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
