import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Goods on Country about partnerships, bulk orders, media enquiries, or anything else. We read every message.',
  openGraph: {
    title: 'Contact · Goods on Country',
    description:
      'Get in touch about partnerships, bulk orders, or media enquiries.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
