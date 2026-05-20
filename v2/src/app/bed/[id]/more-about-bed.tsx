import type { ReactNode } from 'react';

/**
 * Collapsible disclosure that holds the lower-priority sections of the bed
 * page (parts diagram, production history, community siblings, map, journey
 * timeline). Recipient lands on the page and sees the essentials; tapping
 * "More about this bed" reveals the rest. No JavaScript — native <details>.
 */
export function MoreAboutBed({ productNoun, children }: { productNoun: string; children: ReactNode }) {
  return (
    <details className="group max-w-3xl mx-auto px-4 mt-8">
      <summary className="cursor-pointer list-none rounded-2xl border bg-card px-5 py-4 shadow-sm hover:bg-muted/40 transition-colors flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold">More about this {productNoun.toLowerCase()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            How it was made, where it lives, and the story behind it.
          </p>
        </div>
        <span
          aria-hidden
          className="ml-4 text-muted-foreground transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="mt-4 space-y-6">{children}</div>
    </details>
  );
}
