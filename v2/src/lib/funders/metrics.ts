/**
 * Metric resolver registry. Each entry: a metric key (used inside markdown
 * placeholders like `[METRIC: beds-deployed-this-period]`) resolves to a
 * Promise<string> of rendered markdown. Failures return inline error markers
 * so missing data is visible in preview without crashing render.
 */

import type { MetricResolver, ReportContext } from './types';

async function fetchXero<T = unknown>(
  ctx: ReportContext,
  qs: string,
): Promise<T[]> {
  const url = `${ctx.actInfraUrl}/rest/v1/xero_invoices?${qs}`;
  const res = await fetch(url, {
    headers: { apikey: ctx.actInfraKey, Authorization: `Bearer ${ctx.actInfraKey}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`xero ${res.status}: ${await res.text()}`);
  return res.json();
}

// ─── Live-data resolvers ────────────────────────────────────────────────

/**
 * Apply the period window + optional community scope. Centralised so every
 * Supabase query respects the funder's optional community filter the same
 * way. When funder.community is empty the query is all-Goods.
 */
function scopedAssetsQuery(ctx: ReportContext) {
  let q = ctx.goods
    .from('assets')
    .select('unique_id', { count: 'exact', head: true })
    .gte('supply_date', ctx.period.start)
    .lte('supply_date', ctx.period.end);
  if (ctx.funder.community) q = q.eq('community', ctx.funder.community);
  return q;
}

const bedsDeployedThisPeriod: MetricResolver = async (ctx) => {
  const res = await scopedAssetsQuery(ctx).eq('status', 'deployed');
  return String(res.count ?? 0);
};

const bedsAllocatedThisPeriod: MetricResolver = async (ctx) => {
  const res = await scopedAssetsQuery(ctx).eq('status', 'allocated');
  return String(res.count ?? 0);
};

const bedsThisPeriodAllStatuses: MetricResolver = async (ctx) => {
  const res = await scopedAssetsQuery(ctx).in('status', ['deployed', 'allocated']);
  return String(res.count ?? 0);
};

const plasticKgTransferred: MetricResolver = async (ctx) => {
  const res = await scopedAssetsQuery(ctx).in('status', ['deployed', 'allocated']);
  const beds = res.count ?? 0;
  const kg = beds * 20;
  return `**${kg.toLocaleString()} kg** (${(kg / 1000).toFixed(2)} tonnes) — ${beds} beds × 20 kg HDPE`;
};

const communitiesServed: MetricResolver = async (ctx) => {
  // For "communities served" we want the actual list, so re-query with the
  // community column selected. Still respects the funder.community filter
  // (which would short-circuit to a 1-community list when set).
  let q = ctx.goods
    .from('assets')
    .select('community')
    .gte('supply_date', ctx.period.start)
    .lte('supply_date', ctx.period.end)
    .in('status', ['deployed', 'allocated']);
  if (ctx.funder.community) q = q.eq('community', ctx.funder.community);
  const { data } = await q;
  const distinct = new Set((data || []).map((r) => r.community).filter(Boolean));
  return `${distinct.size} (${[...distinct].join(', ')})`;
};

const commitmentProgressBar: MetricResolver = async (ctx) => {
  const c = ctx.funder.commitment;
  if (!c.totalUnits) {
    // Money-only commitments — render an AUD bar instead
    const total = c.totalAud;
    const paid = c.paidToDateAud ?? 0;
    const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
    const filled = Math.round(pct / 5);
    const bar = '▓'.repeat(filled) + '░'.repeat(20 - filled);
    return `\`\`\`\nCommitment:  $${total.toLocaleString('en-AU')}\nPaid:        ${bar} ${pct}%  ($${paid.toLocaleString('en-AU')})\n\`\`\``;
  }
  // Unit-based commitments — count delivered units in period, respecting
  // optional community scope.
  const periodRes = await scopedAssetsQuery(ctx).in('status', ['deployed', 'allocated']);
  const periodCount = periodRes.count ?? 0;
  const total = c.totalUnits;
  const pct = total > 0 ? Math.round((periodCount / total) * 100) : 0;
  const filled = Math.round(pct / 5);
  const bar = '▓'.repeat(filled) + '░'.repeat(20 - filled);
  return `\`\`\`\n${c.unitLabel ?? 'units'} commitment:  ${total} ${c.unitLabel ?? ''}\nDelivered this period: ${bar} ${pct}%  (${periodCount} ${c.unitLabel ?? ''})\n\`\`\``;
};

const xeroDrawnAud: MetricResolver = async (ctx) => {
  const c = ctx.funder.commitment;
  const qs = [
    'select=total,amount_paid,invoice_number,date,status',
    `type=eq.ACCREC`,
    `project_code=eq.${ctx.funder.xeroProjectCode}`,
    `contact_name=eq.${encodeURIComponent(ctx.funder.contactName)}`,
  ].join('&');
  const rows = await fetchXero<{ total: number; amount_paid: number; invoice_number: string; date: string; status: string }>(ctx, qs);
  const totalRaised = rows.reduce((s, r) => s + (r.total || 0), 0);
  const totalPaid = rows.reduce((s, r) => s + (r.amount_paid || 0), 0);
  const commitmentLine = c.totalAud
    ? `Commitment: **$${c.totalAud.toLocaleString('en-AU')}** ex-GST`
    : '';
  return [
    commitmentLine,
    `Xero ACCREC invoices raised (${rows.length}): **$${totalRaised.toLocaleString('en-AU', { maximumFractionDigits: 0 })}**`,
    `Amount paid against those invoices: **$${totalPaid.toLocaleString('en-AU', { maximumFractionDigits: 0 })}**`,
  ].filter(Boolean).join('  \n');
};

const xeroTripOverhead: MetricResolver = async (ctx) => {
  // ACCPAY in the period window — closest proxy for trip-overhead cost
  // (caveat: trip overhead often paid through personal accounts and not in
  // ACCPAY; see wiki/outputs/2026-05-22-utopia-trip-report.md for detail).
  const qs = [
    'select=total,contact_name,date',
    `type=eq.ACCPAY`,
    `project_code=eq.${ctx.funder.xeroProjectCode}`,
    `date=gte.${ctx.period.start}`,
    `date=lte.${ctx.period.end}`,
  ].join('&');
  const rows = await fetchXero<{ total: number; contact_name: string; date: string }>(ctx, qs);
  const total = rows.reduce((s, r) => s + (r.total || 0), 0);
  if (rows.length === 0) {
    return `**$0** — no ACCPAY invoices entered in Xero for this period yet (receipts often paid through personal accounts; reconciliation pending).`;
  }
  return `**$${total.toLocaleString('en-AU', { maximumFractionDigits: 0 })}** across ${rows.length} ACCPAY invoice${rows.length === 1 ? '' : 's'}.`;
};

// ─── Static-from-config resolvers (no live data, but funder-specific) ───

const risksTable: MetricResolver = async (ctx) => {
  const risks = ctx.funder.risks;
  if (!risks || risks.length === 0) return '_(no risks configured)_';
  const head = '| Risk | Status | Mitigation in flight |\n|---|---|---|';
  const rows = risks.map((r) => `| ${r.risk} | ${r.status} | ${r.mitigation} |`);
  return [head, ...rows].join('\n');
};

const principlesAlignmentTable: MetricResolver = async (ctx) => {
  const principles = ctx.funder.principles;
  if (!principles || principles.length === 0) return '_(no principles configured)_';
  return principles
    .map((p) => `### ${p.id}. ${p.name}\n\n${p.evidence}`)
    .join('\n\n');
};

const upcomingCommitmentsTable: MetricResolver = async (ctx) => {
  const upcoming = ctx.funder.upcomingCommitments;
  if (!upcoming || upcoming.length === 0) return '_(no upcoming commitments configured)_';
  const head = '| Activity | Timeline | Status |\n|---|---|---|';
  const rows = upcoming.map((u) => `| ${u.activity} | ${u.timeline} | ${u.status} |`);
  return [head, ...rows].join('\n');
};

const investmentTiersTable: MetricResolver = async (ctx) => {
  const tiers = ctx.funder.investmentTiers;
  if (!tiers || tiers.length === 0) return '_(no investment tiers configured)_';
  return tiers
    .map(
      (t) => `### Priority ${t.priority} — ${t.name} (~$${t.budgetAud.toLocaleString('en-AU')})\n\n${t.description}\n\n**Outcomes:** ${t.outcomes}`,
    )
    .join('\n\n');
};

const headlineAchievements: MetricResolver = async (ctx) => {
  return ctx.funder.headlineAchievements || '_(no headline achievements configured)_';
};

const additionalContext: MetricResolver = async (ctx) => {
  return ctx.funder.additionalContext || '';
};

const financialsAtAGlance: MetricResolver = async (ctx) => {
  const c = ctx.funder.commitment;
  const rows: string[] = [];
  rows.push('| Item | Value |');
  rows.push('|---|---|');
  rows.push(`| **Total commitment** | $${c.totalAud.toLocaleString('en-AU')} ex-GST |`);
  if (c.paidToDateAud !== undefined) rows.push(`| **Paid to date** | $${c.paidToDateAud.toLocaleString('en-AU')} |`);
  if (c.toBePaidAud !== undefined) rows.push(`| **To be paid** | $${c.toBePaidAud.toLocaleString('en-AU')} |`);
  if (c.invoicesRaisedAud !== undefined) rows.push(`| **Xero invoices raised** | $${c.invoicesRaisedAud.toLocaleString('en-AU')} inc-GST |`);
  if (c.reportsSubmitted) rows.push(`| **Reports submitted** | ${c.reportsSubmitted} |`);
  if (c.nextReportDue) rows.push(`| **Next report due** | ${c.nextReportDue} |`);
  if (c.finalReportDue) rows.push(`| **Final report due** | ${c.finalReportDue} |`);
  if (c.grantReference) rows.push(`| **Grant reference** | ${c.grantReference} |`);
  return rows.join('\n');
};

const periodLabel: MetricResolver = async (ctx) => ctx.period.label;
const periodStart: MetricResolver = async (ctx) => ctx.period.start;
const periodEnd: MetricResolver = async (ctx) => ctx.period.end;
const funderDisplayName: MetricResolver = async (ctx) => ctx.funder.displayName;
const funderContactBlock: MetricResolver = async (ctx) => {
  const f = ctx.funder.funderContact;
  if (!f) return '';
  return `**Funder contact:** ${f.name}${f.email ? ` ([${f.email}](mailto:${f.email}))` : ''}${f.phone ? ` · ${f.phone}` : ''}`;
};
const reportTitle: MetricResolver = async (ctx) => ctx.funder.reportTitle(ctx.period);

export const MetricResolvers: Record<string, MetricResolver> = {
  'beds-deployed-this-period': bedsDeployedThisPeriod,
  'beds-allocated-this-period': bedsAllocatedThisPeriod,
  'beds-total-this-period': bedsThisPeriodAllStatuses,
  'plastic-kg-transferred': plasticKgTransferred,
  'communities-served': communitiesServed,
  'commitment-progress-bar': commitmentProgressBar,
  'xero-drawn-aud': xeroDrawnAud,
  'xero-trip-overhead': xeroTripOverhead,
  'risks-table': risksTable,
  'principles-alignment': principlesAlignmentTable,
  'upcoming-commitments-table': upcomingCommitmentsTable,
  'investment-tiers': investmentTiersTable,
  'headline-achievements': headlineAchievements,
  'additional-context': additionalContext,
  'financials-at-a-glance': financialsAtAGlance,
  'period-label': periodLabel,
  'period-start': periodStart,
  'period-end': periodEnd,
  'funder-display-name': funderDisplayName,
  'funder-contact-block': funderContactBlock,
  'report-title': reportTitle,
};

export async function resolveMetric(key: string, ctx: ReportContext): Promise<string> {
  const resolver = MetricResolvers[key];
  if (!resolver) return `[METRIC ERROR: ${key} — no resolver]`;
  try {
    return await resolver(ctx);
  } catch (e) {
    return `[METRIC ERROR: ${key} — ${(e as Error).message}]`;
  }
}
