import type { Metadata } from 'next';

// The sponsor page is a client component, so its metadata lives here.
// This is a primary conversion page — keep it indexable with a real
// description (it previously fell back to the root layout's generic one).
export const metadata: Metadata = {
  title: 'Sponsor Beds — Goods on Country',
  description:
    'Sponsor Stretch Beds for families in remote Indigenous communities. Every bed is flat-packable, washable, made from recycled plastic and built to last.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/sponsor',
  },
};

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
