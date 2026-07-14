'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { ImpactBanner } from './impact-banner';

// Routes that should render WITHOUT the public site header, footer, and impact banner.
// Funder briefs are confidential investor docs and should not display the public nav.
// Field-notes are full-bleed immersive scrollytelling — they own the whole viewport.
const STANDALONE_PATH_PREFIXES = ['/funders', '/insiders', '/investors', '/admin', '/field-notes', '/sites', '/deck'];

// Standalone routes matched by pattern rather than prefix. The gated partner
// dashboard (/partners/<slug>/dashboard) is a confidential, full-page funder
// experience with its own header — it must NOT carry the marketing nav, cart, or
// "Buy Now". The PUBLIC partner pages (/partners/centrecorp etc.) keep the chrome.
const STANDALONE_PATH_PATTERNS = [/^\/partners\/[^/]+\/dashboard(\/|$)/];

// Routes where the global ImpactBanner competes with page-specific stats.
// These pages carry their own product/place numbers, so suppress the global strip.
const IMPACT_BANNER_HIDDEN_PREFIXES = [
  '/canberra',
  '/shop/stretch-bed-single',
  '/bed',
];

function isStandalone(pathname: string | null) {
  if (!pathname) return false;
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
