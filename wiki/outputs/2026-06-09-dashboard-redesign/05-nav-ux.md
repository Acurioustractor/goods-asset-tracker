I have enough to write a definitive, grounded pattern set. Compiling the report now.

---

# Long-Scroll + Scrollytelling UX Pattern Set — Goods Partner/Funder Dashboard

A navigable single-page experience that stays oriented and never becomes an endless dump. Built for Next.js 16 (App Router, RSC), React 19, Tailwind 4. Every pattern below maps to the existing dashboard sections (funding targets, community-owned assets, QBE growth, community voice, data confidence) and honours the brand + non-extractive rules.

## TL;DR — what to build

A **two-rail spine**: a left sticky scrollspy nav (the "On this page" rail with a section progress indicator) + a single scrolling content column. Sticky section headers inside long sections. A thin top scroll-progress bar. Sparse, opt-in scroll-driven reveals (never load-bearing). On mobile the rail collapses to a sticky condensed "jump to" bar. This is the Stripe-docs / Linear-changelog / GitHub-README-TOC family of layout, plus selective Pudding/NYT sticky-graphic moments only where a number genuinely needs a visual to land.

---

## Why long-scroll beats tabs here (the core rationale)

Tabs **hide** content behind a click and **reset reading context** on every switch — they imply the sections are peers you choose between. This dashboard is an *argument with a direction*: where we are → where we are going → the assets we are building → how QBE compounds it → how sure we are. That is a narrative with momentum, and momentum dies at a tab boundary. A funder skimming should be able to fall down the page and absorb the through-line; a long scroll preserves the spatial memory ("the funding targets were just above the community-owned assets") that tabs destroy. Tabs also fragment print/PDF export and hurt deep-linking and SEO. The single page keeps one URL, one print target, and hash-addressable sections for sharing. The job of the patterns below is to give the *orientation* tabs provided (where am I, what else is here) **without** the fragmentation.

---

## Pattern 1 — Left sticky scrollspy nav ("On this page" rail)

**The recommended spine.** Best-in-class: Stripe docs, Linear docs/changelog, Vercel docs, GitHub README TOC rail, MDN.

- **When:** Always, as the backbone of the desktop layout. 4–8 top-level sections, optional one level of sub-anchors.
- **UX rationale vs tabs:** It is a *map you never leave*, not a *door you walk through*. The reader sees the full set of sections at all times (so nothing is "hidden" the way a tab does), the active item highlights as they scroll (constant "you are here"), and clicking jumps without a context reset. It restores every orientation benefit of tabs while keeping the content contiguous.
- **Implementation (IntersectionObserver, not scroll-math):**
  - One observer watching all `<section id>` headings. Use a `rootMargin` that creates a thin "trigger band" near the top, e.g. `rootMargin: "-45% 0px -50% 0px"` — this fires when a section crosses the upper-middle of the viewport, which prevents the classic "two sections active at once" and "last short section never activates" bugs better than `threshold` alone.
  - Track the *last* intersecting entry by document order so fast scrolls resolve to a single active id.
  - Set active id in `useState`; the nav `<a aria-current="true">` styles the active link.
  - This rail must be a **client component** (`'use client'`) and a leaf — keep the page a Server Component and mount only the rail/observer on the client. Sections themselves stay RSC.
  - Hash-link + scroll: native anchor jumps via `href="#assets"`; add `scroll-margin-top` (Tailwind `scroll-mt-24`) on every `<section>` so the sticky header/topbar doesn't cover the heading. Use `scroll-behavior: smooth` gated behind `motion-safe`.
  - A11y: the rail is `<nav aria-label="On this page">` containing a real `<ul>` of in-page links. Clicking should move focus to the target section heading (`tabIndex={-1}` + `.focus()` in the click handler) so keyboard/screen-reader users land where sighted users do — IntersectionObserver only updates the *visual* highlight, never focus.

Sketch:

```tsx
'use client';
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
      const current = ids.find(id => seen.get(id));
      if (current) setActive(current);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
```

```tsx
<nav aria-label="On this page" className="sticky top-24 self-start">
  <ul>
    {sections.map(s => (
      <li key={s.id}>
        <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}
           className={active === s.id ? 'text-[#C45C3E] font-medium' : 'text-stone-500'}>
          {s.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

The layout container: `<div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-12">` — sticky nav in col 1, content in col 2. `self-start` on the sticky child is the one easy-to-miss requirement (without it the sticky element stretches the grid row and never sticks).

---

## Pattern 2 — Top scroll-progress indicator

Best-in-class: Apple product pages, long Medium/editorial reads.

- **When:** Always, as a thin 2–3px bar pinned at the very top (or as a fill on the active nav item). One global signal of "how far through am I."
- **Rationale vs tabs:** Tabs give a false sense of completion ("I clicked all 4, I'm done"). A progress bar honestly communicates *depth remaining* on a page a funder might otherwise abandon early — it reassures that the page is finite.
- **Implementation (zero-JS, compositor-thread):** Pure CSS scroll-driven animation — `animation-timeline: scroll(root)` scales a fixed bar from `scaleX(0)` to `scaleX(1)`. Supported in Chrome/Edge/Safari 26; Firefox behind a flag, so it degrades to a static (or absent) bar harmlessly. Gate the whole thing in `@media (prefers-reduced-motion: no-preference)` so reduced-motion users get no animated bar.

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes grow-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .scroll-progress {
    position: fixed; inset: 0 0 auto 0; height: 3px; transform-origin: left;
    background: #C45C3E; z-index: 50;
    animation: grow-progress linear; animation-timeline: scroll(root);
  }
}
```

If you want it inside the nav rail instead, run the same idea per-section so each rail item fills as you read it.

---

## Pattern 3 — Sticky section headers (in-section orientation)

Best-in-class: Stripe API reference, Notion long docs, iOS grouped-table headers.

- **When:** Inside any section tall enough to scroll past its own heading (your assets and confidence sections especially). The section's `<h2>` (+ its confidence badge) sticks to just under the top bar while you read its body, then yields to the next.
- **Rationale vs tabs:** This is the micro-version of the orientation a tab label gave — but it travels *with* the content instead of replacing it. The reader always knows which section's numbers they're looking at, and the confidence grade (COUNTED / MODELLED / NOT-YET-MEASURED) rides along in the sticky header so it's never lost below the fold.
- **Implementation:** `position: sticky; top: var(--topbar)`; in Tailwind `sticky top-16 z-10 bg-[#FDF8F3]/95 backdrop-blur`. The opaque/blur background is required so scrolling body text doesn't bleed through. Gotcha: a sticky header only sticks within its own scroll parent — keep each `<section>` as the direct child of the scrolling column and ensure no ancestor has `overflow: hidden` (it silently kills sticky).

---

## Pattern 4 — Scroll-driven reveal (entrance) animations

Best-in-class: Linear marketing, Vercel, Apple — subtle fade/translate-up as blocks enter.

- **When:** Sparingly, for section intros and key metric cards. **Never** for anything the reader must be able to read immediately, and never as the *only* way content appears.
- **Rationale vs tabs:** Gives the page life and pacing (a tab dump appears all-at-once and feels static), and naturally chunks a long page into digestible beats.
- **Implementation:** Prefer CSS `animation-timeline: view()` (compositor-threaded, no JS) for fade-in-on-enter. Critically: author the *default* state as fully visible, then apply the animation only inside `@media (prefers-reduced-motion: no-preference)` and feature-query `@supports (animation-timeline: view())`. This guarantees content is visible with reduced motion, with JS disabled, and on unsupported browsers — the animation is pure enhancement.

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal { animation: fade-up linear both; animation-timeline: view(); animation-range: entry 0% cover 30%; }
    @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  }
}
```

If you need React-controlled reveals (e.g. count-up numbers), use IntersectionObserver with a `motion-reduce:` Tailwind variant to skip the animation and show the final number instantly. Respect reduced motion in JS too: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

---

## Pattern 5 — Sticky-graphic scrollytelling ("pin one visual, narrate around it")

Best-in-class: NYT *Snow Fall*, The Pudding, Our World in Data explainers.

- **When:** **One or two moments only.** This is the heavy artillery — reserve it for the single most important argument where a number needs a visual to *change as you read*. For Goods, the natural fit is **the community-owned-asset pathway** (one diagram of the containerised plant that progresses build → deploy → community ownership as text steps scroll) or **the QBE compounding model** (the same capital stack visual annotating itself as matched-funding steps reveal). Do not scrollytell the whole page; it would bury the scannable funder.
- **Rationale vs tabs:** A tab can only show a static before/after. Pinned scrollytelling lets a single asset *evolve* in lockstep with the explanation — ideal for "the plant moves to community ownership," which is a process, not a snapshot.
- **Implementation (CSS `position: sticky`, per The Pudding — the lowest-bug approach):**
  - Structure: a tall outer `<section>` (the "scroll runway") containing two children — a `sticky top-0 h-screen` graphic, and a sibling column of text "steps."
  - The graphic sticks and unsticks **only within the bounds of its parent**, so the parent's height *is* the pin duration. Keep the graphic as a direct child; longer text column = longer pin.
  - Use IntersectionObserver on each `.step` (a `rootMargin: '-50% 0px -50% 0px'` "trip-line" at viewport centre) to set the active step index, which swaps/annotates the pinned graphic.
  - **Gotchas:** any ancestor with `overflow: hidden` breaks `sticky`; the sticky child must not itself be inside a flex parent that shrinks it; give the graphic a fixed height (`h-[100svh]`) so it doesn't jump.
  - **Mobile + reduced motion:** collapse the pin to a normal stacked flow — render each step's graphic state *inline above its text*, no pinning. Detect with the same `prefers-reduced-motion` query and a `lg:` breakpoint; the content reads identically as a plain sequence. This is The Pudding's stated responsive rule: degrade scrollytelling to linear stacked content on small screens.

---

## Pattern 6 — In-page anchor "jump nav" / chapter chips

Best-in-class: GitHub TOC, MDN "In this article," Stripe.

- **When:** As the mobile fallback for Pattern 1, and optionally as a horizontal chip row under the hero on desktop ("Funding targets · Community-owned assets · Growth through QBE · Community voice · How sure are we").
- **Rationale vs tabs:** Looks tab-like (familiar affordance) but *scrolls* instead of *swapping* — you get tab-grade scannability of the section set with zero content fragmentation, and it doubles as the table of contents.
- **Implementation:** Plain anchor links with `scroll-mt-*` on targets. The active chip can share the scrollspy `active` state. Keep it `<nav aria-label="Sections">` with real links.

---

## Mobile behaviour (graceful collapse — non-negotiable)

- The left rail **does not exist** below `lg`. Replace it with a **sticky condensed bar** under the header: either a single-line "On this page ▾" disclosure that expands to the anchor list, or the horizontal scrolling chip row (Pattern 6). Keep it `position: sticky; top: 0` so orientation survives.
- All sticky offsets become CSS variables driven off the (taller, possibly stacked) mobile header — wrong offsets are the #1 mobile sticky bug. Use a `--topbar` custom property set per breakpoint, referenced by every `scroll-mt`/`top`.
- Scrollytelling pins **turn off** on mobile (Pattern 5) — stacked linear content only.
- Touch targets in the jump nav ≥44px; the disclosure is a real `<button aria-expanded>`.

---

## Cross-cutting accessibility + performance checklist

- **Reduced motion everywhere:** every animated thing (progress bar, reveals, smooth scroll, scrollytelling) lives behind `prefers-reduced-motion: no-preference`. Default (no-JS, no-CSS-support, reduced-motion) state must be fully readable. This also serves the non-extractive/dignity ethos: no gratuitous motion over community content.
- **Focus management:** scrollspy updates *visual* highlight only; never steal or move focus on scroll. Move focus *only* on explicit anchor click. Respect that `aria-current="true"` marks the active TOC link.
- **Compositor-thread first:** prefer CSS scroll-driven animations (`scroll()` / `view()`) over JS scroll listeners so the page stays smooth even while the live Supabase/EL data hydrates. If you must listen to scroll in JS, throttle with `requestAnimationFrame` or (better) use IntersectionObserver, which is event-driven not poll-driven.
- **RSC boundary:** page + all data sections are Server Components; only the scrollspy rail, the mobile disclosure, and any count-up animators are `'use client'` leaves. Keeps the data-heavy dashboard fast and the interactive chrome thin.
- **Deep-linking + print:** stable `id`s on every section give shareable `#anchor` URLs and a clean single-document print/PDF — both impossible with tabs, both valuable for funders.
- **Tailwind 4 niceties:** use logical-property utilities and `scroll-mt-*`, the `motion-safe:`/`motion-reduce:` variants, and `supports-[animation-timeline:view()]:` arbitrary variant to scope enhancements. Define `--topbar` as a theme token so every sticky offset references one source of truth.

---

## Recommended "spine" layout (assembled)

```
┌─ top scroll-progress bar (CSS scroll(), motion-safe) ──────────────┐
├─ sticky site/partner header (--topbar) ───────────────────────────┤
│  HERO  (the 5 hero answers, each with a COUNTED/MODELLED/NYM badge)│
│  ─ mobile: sticky "On this page ▾" disclosure appears below hero ─ │
├────────────┬──────────────────────────────────────────────────────┤
│ STICKY     │  §1 Where we are            (sticky h2 + confidence)  │
│ SCROLLSPY  │  §2 Where we're going / TARGETS                       │
│ NAV RAIL   │  §3 Community-owned assets   ← Pattern-5 sticky graphic│
│ (desktop,  │  §4 Growth through QBE       ← optional 2nd pin       │
│  self-start│  §5 Community voice (consented quotes/themes)         │
│  top-24,   │  §6 How sure are we (confidence method)               │
│  active=IO)│  each §: scroll-mt-24, reveal-on-enter (motion-safe)  │
└────────────┴──────────────────────────────────────────────────────┘
```

- Desktop: `grid lg:grid-cols-[220px_minmax(0,1fr)]`, rail `sticky top-24 self-start`, content column holds the RSC sections.
- Each section: `id`, `scroll-mt-24`, a sticky `<h2>` carrying its confidence badge, optional `.reveal`.
- Two sections (assets, QBE) may upgrade to Pattern-5 sticky-graphic runways; everything else is straight long-scroll with reveals.
- Mobile: rail → sticky disclosure/chips; pins → linear stacks; one `--topbar` token drives all offsets.

This gives a funder the scannability and orientation of tabs (full section map always visible, active-state "you are here," progress signal, jump links) on a single contiguous, deep-linkable, printable narrative that carries the forward-looking argument — with scrollytelling held in reserve for the one or two moments where a moving visual earns its weight.

**Reusable-template note:** the rail's `sections[]` array (id + label) and the per-section confidence badge are the only audience-specific config. Swap the array and the section components per audience (partner / supporter / funder); the spine, scrollspy hook, sticky/offset tokens, and motion/a11y scaffolding are identical across all three.

---

**Sources:**
- [Sticky Table of Contents with Scrolling Active States — CSS-Tricks](https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/)
- [Table of Contents with IntersectionObserver — CSS-Tricks](https://css-tricks.com/table-of-contents-with-intersectionobserver/)
- [Scrollspy demystified — Maxime Heckel](https://blog.maximeheckel.com/posts/scrollspy-demystified/)
- [Easier scrollytelling with position:sticky — The Pudding](https://pudding.cool/process/scrollytelling-sticky/)
- [Responsive scrollytelling best practices — The Pudding](https://pudding.cool/process/responsive-scrollytelling/)
- [How to implement scrollytelling — The Pudding](https://pudding.cool/process/how-to-implement-scrollytelling/)
- [Scrolling Designs: 8 Patterns and When to Use Each — Lovable](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use)
- [CSS scroll-driven animations — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Scroll-driven animation timelines — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines)
- [Scroll-Driven Animations — Josh W. Comeau](https://www.joshwcomeau.com/animation/scroll-driven-animations/)
- [animation-timeline: scroll() support — Can I Use](https://caniuse.com/mdn-css_properties_animation-timeline_scroll)