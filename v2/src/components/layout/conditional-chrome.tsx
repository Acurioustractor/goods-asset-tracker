'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { ImpactBanner } from './impact-banner';

// Routes that should render WITHOUT the public site header, footer, and impact banner.
// Funder briefs are confidential investor docs and should not display the public nav.
const STANDALONE_PATH_PREFIXES = ['/funders'];

function isStandalone(pathname: string | null) {
  if (!pathname) return false;
  return STANDALONE_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function ConditionalSiteHeader() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <SiteHeader />;
}

export function ConditionalImpactBanner() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <ImpactBanner />;
}

export function ConditionalSiteFooter() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <SiteFooter />;
}
