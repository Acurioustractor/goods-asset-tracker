import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleRenderer } from '@/components/insiders/article-renderer';
import { PLAYBOOK_MD } from '../playbook-content';

export const metadata: Metadata = {
  title: 'Cost Lab Playbook',
  description:
    'Analogies, audience one-liners, set plays and the first working-session agenda for the Goods Cost Lab.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CostLabPlaybookPage() {
  return (
    <main className="min-h-screen bg-goods-cream pb-24">
      <header className="border-b border-stone-200 bg-goods-ink text-goods-cream">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Link
            href="/sites/cost-lab"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-goods-gold hover:text-goods-cream"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to the Cost Lab
          </Link>
          <h1 className="mt-3 font-serif text-3xl">The Cost Lab Playbook</h1>
          <p className="mt-2 text-sm leading-6 text-goods-grid">
            Keep this open beside the lab: the analogies for talking to each other, the one-liners
            per audience, the five set plays with exact dials, and the first working-session agenda.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ArticleRenderer>{PLAYBOOK_MD}</ArticleRenderer>
      </div>
    </main>
  );
}
