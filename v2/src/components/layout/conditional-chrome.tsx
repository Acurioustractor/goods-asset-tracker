'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { ImpactBanner } from './impact-banner';

// Routes that should render WITHOUT the public site header, footer, and impact banner.
// Funder briefs are confidential investor docs and should not display the public nav.
// Field-notes are full-bleed immersive scrollytelling. Pitch working surfaces
// should not carry the public site chrome.
const STANDALONE_PATH_PREFIXES = [
  '/funders',
  '/insiders',
  '/investors',
  '/admin',
  '/export',
  '/field-notes',
  '/sites',
  '/pitch/community-narrative',
  '/pitch/investor-lab',
  '/pitch/miro-board',
  // THE deck (ruling R). Ben, 2026-08-06: the marketing nav and the impact banner were eating
  // the top of every panel, so no full-screen panel actually fit the screen. The deck carries
  // its own chrome (opener, contents bar, pack switcher) and its own stat line on the cover.
  '/pitch/road',
  '/deck',
  // Printable one-pager family (2026-08-06): print artifacts with their own masthead.
  '/onepagers',
];

// Standalone routes matched by pattern rather than prefix. The gated partner
// dashboard (/partners/<slug>/dashboard) is a confidential, full-page funder
// experience with its own header, so it must NOT carry the marketing nav, cart, or
// "Buy Now". The PUBLIC partner pages (/partners/centrecorp etc.) keep the chrome.
// `story` added 2026-09-16 with the Snow partnership report, which is the same kind of thing
// and was shipping with "Buy a bed" and a cart above a private funder report.
const STANDALONE_PATH_PATTERNS = [/^\/partners\/[^/]+\/(dashboard|story)(\/|$)/];

// Routes where the global ImpactBanner competes with page-specific stats.
// These pages carry their own product/place numbers, so suppress the global strip.
const IMPACT_BANNER_HIDDEN_PREFIXES = [
  '/canberra',
  '/shop/stretch-bed-single',
  '/bed',
];

// Exact routes only. The two pitch doors carry their own chapter menu (Ben, 15 Sep 2026); other
// /pitch/* pages keep the site chrome.
const STANDALONE_EXACT_PATHS = ['/pitch', '/pitch/qbe'];

function isStandalone(pathname: string | null) {
  if (!pathname) return false;
  if (STANDALONE_EXACT_PATHS.includes(pathname)) return true;
  if (STANDALONE_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  return STANDALONE_PATH_PATTERNS.some((re) => re.test(pathname));
}

function hideImpactBanner(pathname: string | null) {
  if (!pathname) return false;
  if (isStandalone(pathname)) return true;
  return IMPACT_BANNER_HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function ConditionalSiteHeader() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <SiteHeader />;
}

export function ConditionalImpactBanner() {
  const pathname = usePathname();
  if (hideImpactBanner(pathname)) return null;
  return <ImpactBanner />;
}

export function ConditionalSiteFooter() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <SiteFooter />;
}
