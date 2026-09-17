import type { Metadata } from 'next';
import { paidBuyers } from '@/lib/data/outreach-targets';
import { SELLER_READINESS } from '@/lib/data/seller-readiness';
import { DeskClient } from './desk-client';

/**
 * THE DESK. One consolidated dashboard answering the three questions that actually matter for
 * selling more beds and washers: who repeats and why (Relationships), who can legally buy
 * without a tender (Legal pathways), and who has said yes to being the seller (Readiness).
 *
 * Built 17 Sep 2026 from the Pencil design at design/Goods Dashboard.pen ("Relationships View",
 * "Legal Pathways View", "Readiness View"). Reuses paidBuyers from outreach-targets.ts (real,
 * invoice-evidenced trade) rather than duplicating it — see /admin/funding-board for the fuller
 * buyer/funder/prospect table and /admin/procurement for the full jurisdiction breakdown; this
 * page links out to both rather than re-render their full complexity.
 */

export const metadata: Metadata = {
  title: 'The Desk | Goods admin',
  robots: { index: false, follow: false },
};

export default function DeskPage() {
  return <DeskClient buyers={paidBuyers} readiness={SELLER_READINESS} />;
}
