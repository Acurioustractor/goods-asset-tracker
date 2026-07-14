import type { Metadata } from 'next';

// Checkout flow pages carry no indexable content and should never appear in
// search results.
export const metadata: Metadata = {
  title: 'Checkout — Goods on Country',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
