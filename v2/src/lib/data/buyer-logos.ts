/**
 * Logos for the organisations that have bought and paid for beds (pitch-chapters.ts BUYERS). Ben,
 * 16 September 2026: show them, it makes the trade legitimate. Each file was taken from the
 * organisation's own website on that day and trimmed, never redrawn:
 *   ALIVE National Centre: alivenetwork.com.au (the published SVG, rendered to PNG)
 *   Homeland School Company: homelandschoolcompany.org.au
 *   Mala'la Health Service Aboriginal Corporation: malala.com.au
 *   Centrecorp Foundation: the logo already in /images/partners, background made transparent
 * buyer-logos.guards.test.ts holds every paid buyer to a logo that ships.
 */

export interface BuyerLogo {
  src: string;
  width: number;
  height: number;
  href: string;
}

export const BUYER_LOGOS: Record<string, BuyerLogo> = {
  'Centrecorp Foundation': { src: '/images/partners/buyers/centrecorp-foundation.png', width: 347, height: 165, href: '/partners/centrecorp' },
  'ALIVE National Centre': { src: '/images/partners/buyers/alive-national-centre.png', width: 700, height: 191, href: 'https://alivenetwork.com.au' },
  'Homeland School Company, Maningrida': { src: '/images/partners/buyers/homeland-school-company.png', width: 600, height: 403, href: 'https://homelandschoolcompany.org.au' },
  "Mala'la Health Service, Maningrida": { src: '/images/partners/buyers/malala-health-service.png', width: 480, height: 480, href: 'https://www.malala.com.au' },
};
