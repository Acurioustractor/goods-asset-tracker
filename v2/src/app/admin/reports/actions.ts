'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import { getFunder } from '@/lib/funders/registry';
import { generateReport } from '@/lib/funders/generate';
import type { ReportPeriod, ReportContext } from '@/lib/funders/types';
import { QUARTERS } from './quarters';

const ACT_URL = process.env.ACT_INFRA_SUPABASE_URL || '';
const ACT_KEY = process.env.ACT_INFRA_SUPABASE_KEY || '';
const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

export async function generateFunderReport(funderSlug: string, periodSlug: string): Promise<{
  ok: boolean;
  path?: string;
  bytes?: number;
  sections?: number;
  error?: string;
}> {
  const funder = await getFunder(funderSlug);
  if (!funder) return { ok: false, error: `Unknown funder: ${funderSlug}` };
  const q = QUARTERS[periodSlug];
  if (!q) return { ok: false, error: `Unknown period: ${periodSlug}` };
  if (!ACT_URL || !ACT_KEY) return { ok: false, error: 'ACT_INFRA_SUPABASE_* not configured' };
  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) return { ok: false, error: 'EL env not configured' };

  const period: ReportPeriod = { slug: periodSlug, label: q.label, start: q.start, end: q.end };

  const goods = createServiceClient();
  const ctx: ReportContext = {
    funder,
    period,
    goods,
    actInfraUrl: ACT_URL,
    actInfraKey: ACT_KEY,
    elUrl: EL_URL,
    elKey: EL_KEY,
    elProjectId: EL_PROJECT_ID,
  };

  try {
    const result = await generateReport(funder, period, ctx);
    // Bust the deck preview so the new report renders immediately.
    revalidatePath('/admin/reports');
    revalidatePath('/admin/deck');
    return { ok: true, ...result };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
