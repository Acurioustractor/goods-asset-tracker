/**
 * Investor cost story (/investors) — the SAME narrative cost model as
 * /admin/cost-model, behind the lightweight shared-password gate in proxy.ts
 * (INVESTORS_PASSWORD) instead of the admin email/allowlist auth.
 *
 * This is the door QBE / investment partners click from the Notion QBE Diagnostic
 * pages. It renders the seven-chapter cost story with honesty labels — no admin
 * data, no auth-gated content. The interactive skin prototypes it previously
 * showed were retired 2026-07-20 (archived at _archive/2026-07-20-cost-model-skins/).
 */
import CostStoryPage from '@/app/admin/cost-model/page';

export const metadata = {
  title: 'The Cost Story — Goods on Country',
  description:
    'The Goods cost model as a plain-language narrative: what a bed costs, what stays, and what the capital buys — every figure labelled by how solid it is.',
};

export default function InvestorsCostStoryPage() {
  return (
    <div className="w-full bg-background px-4 py-10 sm:px-6">
      <CostStoryPage />
      <p className="py-4 text-center text-xs text-muted-foreground">
        Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation.
      </p>
    </div>
  );
}
