'use client';

/**
 * On a phone, the rest of a block waits behind "Read more"; on a wider screen it simply shows.
 * The children stay in the page either way, so nothing is lost to search or a screen reader
 * that reads the wide layout.
 */

import { useId, useState, type ReactNode } from 'react';

export function MobileReadMore({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} className={open ? '' : 'hidden md:block'}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta ${dark ? 'border-goods-cream/30 text-goods-cream' : 'border-goods-ink/25 text-goods-ink'}`}
      >
        {open ? 'Show less' : 'Read more'}
        <span className={`text-lg leading-none transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
      </button>
    </>
  );
}
