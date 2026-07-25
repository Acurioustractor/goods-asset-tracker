import type { ReactNode } from 'react';

/**
 * Deck-export layout. Renders the page and nothing else: no admin sidebar, no
 * site header, no search box, no toggles. The public header and footer are
 * suppressed for /export in conditional-chrome.tsx, so a headless screenshot
 * of an /export route lands slide-ready.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function ExportLayout({ children }: { children: ReactNode }) {
  return <div className="bg-[#FBF8F1]">{children}</div>;
}
