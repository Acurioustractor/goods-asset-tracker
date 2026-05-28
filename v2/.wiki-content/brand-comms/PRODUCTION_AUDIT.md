# Production audit: 2026-05-08

> Snapshot of what was live on www.goodsoncountry.com when this PR landed. Use as a baseline. Re-run after merge to confirm new surfaces deploy correctly.

## Summary

- **Static images:** 100% pass. All 7 sampled image paths return 200 with reasonable file sizes.
- **Existing pages:** 6 of 6 sampled pages (/, /about, /impact, /process, /stories, /shop/stretch-bed-single) return 200.
- **New routes from this PR:** all 404 (expected, awaiting merge).
- **Empathy Ledger endpoint:** the default URL in the EL client was wrong (`empathy-ledger.vercel.app`). Real endpoint is `empathy-ledger-v2.vercel.app`. Fixed in [v2/src/lib/empathy-ledger/client.ts](../../v2/src/lib/empathy-ledger/client.ts).
- **Doc references:** brand-comms docs claimed the EL stories endpoint was on `goodsoncountry.com`. It's not. Corrected.

## Pages tested

| Path | Production status | After PR merge |
|------|------------------:|----------------|
| `/` | 200 | 200 (favicon and OG meta swap to /brand/* SVGs) |
| `/about` | 200 | 200 (voice fixes from this PR) |
| `/impact` | 200 | 200 (voice fixes) |
| `/process` | 200 | 200 (voice fixes) |
| `/stories` | 200 | 200 (voice fixes) |
| `/shop/stretch-bed-single` | 200 | 200 (voice fixes) |
| `/communities` | 404 | unchanged (correct path is `/community` singular, see footer) |
| `/brand` | 404 | 200 (new public brand page) |
| `/decks/live-session-deck.html` | 404 | 200 (10-slide deck) |
| `/api/press-kit` | 404 | 200 (structured JSON) |
| `/api/brand-lint?text=we+donate` | 404 | 200 (voice linter API) |
| `/tools/brand-lint` | 404 | 200 (linter UI) |
| `/tools/signature` | 404 | 200 (signature generator) |
| `/brand/wordmark-light.svg` | 404 | 200 (placeholder logo) |
| `/brand/og-image.svg` | 404 | 200 (placeholder OG) |
| `/brand/favicon.svg` | 404 | 200 (placeholder favicon) |

## Image asset spot check

All sampled paths returned 200 with sensible byte sizes:

| Path | Size |
|------|-----:|
| `/images/people/dianne-stokes.jpg` | 282 KB |
| `/images/people/norman-frank.jpg` | 219 KB |
| `/images/people/ivy.jpg` | 1.22 MB |
| `/images/product/stretch-bed-hero.jpg` | 503 KB |
| `/images/media-pack/goods-branding-golden-hour.jpg` | 109 KB |
| `/images/process/04-build.jpg` | 218 KB |
| `/images/community/tennant-creek.jpg` | 622 KB |

## Homepage image references

The homepage HTML returned 19 unique Next.js Image-optimised refs covering:

- `media-pack/`: 3 photos (community-bed-assembly, community-testing-bed-golden-hour, nic-with-elder-on-verandah)
- `people/`: 2 photos (Brian Russell, Ivy)
- `pitch/`: 8 component shots (frame-legs, poles, canvas, sequence steps, assembled)
- `process/`: 5 manufacturing photos (CNC, color samples, container factory, hydraulic press, pressed sheets)
- `product/`: 2 photos (stretch-bed-community, stretch-bed-kids-building)

All resolve via the Next.js image optimisation pipeline (`/_next/image?url=...`) with proper w/q params and dpl deployment hash. No placeholders or undefined srcs detected.

## Meta tags currently in production

```
<link rel="icon" href="/favicon.ico?favicon.0b3bf435.ico">
```

No `og:image` or `twitter:image` meta tags found in the rendered HTML. After this PR deploys, the new metadata in [v2/src/app/layout.tsx](../../v2/src/app/layout.tsx) will add:

- `<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">`
- `<meta property="og:image" content="/brand/og-image.svg">` (1200×630)
- `<meta name="twitter:image" content="/brand/og-image.svg">`
- Updated `og:title`, `og:description`, `og:url`

## Empathy Ledger endpoint findings

The EL client's default URL was wrong:

```ts
// Before (would 404 if EMPATHY_LEDGER_API_URL env var were unset)
'https://empathy-ledger.vercel.app'

// After
'https://empathy-ledger-v2.vercel.app'
```

In production this likely never broke because `EMPATHY_LEDGER_API_URL` is set via Vercel env vars. But the default fallback is now correct, so any future deployment without the env var will still reach the right host.

**Doc fixes:**
- `wiki/articles/brand-comms/02-storyteller-voices.md` — corrected the curl example to point at `empathy-ledger-v2.vercel.app`
- `wiki/articles/brand-comms/06-asset-register.md` — clarified the EL endpoint is NOT proxied through goodsoncountry.com
- `v2/src/lib/empathy-ledger/featured-voices.ts` — clarified comment

## After-merge verification checklist

When PR #22 deploys to production, re-run this audit:

```bash
python3 -c "
import urllib.request, socket
socket.setdefaulttimeout(20)
BASE = 'https://www.goodsoncountry.com'
PATHS = ['/brand', '/tools/brand-lint', '/tools/signature',
         '/api/press-kit', '/api/brand-lint?text=test',
         '/decks/live-session-deck.html',
         '/brand/wordmark-light.svg', '/brand/og-image.svg', '/brand/favicon.svg']
for p in PATHS:
    try:
        req = urllib.request.Request(BASE + p, method='HEAD')
        with urllib.request.urlopen(req) as r:
            code = r.status
    except Exception as e:
        code = getattr(e, 'code', 'ERR')
    print(f'  {code:>4}  {p}')
"
```

All should return 200. Then spot-check `/brand` for visible storyteller portraits (live from EL or local fallback), correct counts in the photography library section, and the embedded deck rendering.

## Open questions raised by audit

- `/communities` is 404 in production but referenced by some pages. Footer uses `/community` (singular). Confirm naming and redirect or fix references.
- The `/api/stories` endpoint referenced in some places does not exist on the Goods site itself. Anyone needing live storyteller data must hit `https://empathy-ledger-v2.vercel.app/api/stories` directly, or use the existing `empathyLedger.getStories()` server helper.

## Last revised
2026-05-08, end of audit.
