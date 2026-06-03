/**
 * Investor cockpit (/investors) — the SAME verified cost-model engine + skins as
 * /admin/cost-model, but behind the lightweight shared-password gate in proxy.ts
 * (INVESTORS_PASSWORD) instead of the admin email/allowlist auth.
 *
 * This is the door QBE / investment partners click from the Notion QBE Diagnostic
 * pages: one shared password, then the interactive Investment + Mission Control cockpit.
 * All math is locked client-side (no admin data), so nothing auth-gated leaves the
 * engine. Renders standalone (conditional-chrome hides the public site nav on
 * /investors) so the cockpit owns the full viewport, exactly like the admin route.
 *
 * Defaults to the Investment skin (margin waterfall · brokerage · debt-service) —
 * the most decision-relevant view for this audience; Mission Control / Tesla /
 * Terminal are one toggle away and the choice is shareable via ?skin=.
 */
import { Suspense } from 'react';
import { CostModelWorkspace } from '@/app/admin/cost-model/cost-model-workspace';

export const metadata = {
  title: 'Investor Cockpit — Goods on Country',
  description:
    'Interactive verified bed cost model + investment view. Marginal-cost-first, QBE-ready capital case.',
};

export default function InvestorsCockpitPage() {
  return (
    <div className="w-full px-4 sm:px-6">
      <Suspense
        fallback={
          <div className="py-20 text-center text-sm text-gray-400">Loading cost model…</div>
        }
      >
        <CostModelWorkspace defaultSkin="investment" />
      </Suspense>
    </div>
  );
}
