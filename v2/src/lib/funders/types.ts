/**
 * Funder reporting template system — shared types.
 *
 * One TypeScript type for the per-funder config, the per-period report
 * context, and the section + placeholder vocabulary. Configs live under
 * ./configs/{slug}.ts. Registry assembled in ./registry.ts. Resolvers in
 * ./metrics.ts.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// 17 canonical section keys. Each maps to a markdown file under
// wiki/templates/funder-report/sections/{nn}-{slug}.md. Per-funder configs
// pick an ordered subset.
export type SectionKey =
  | 'cover'
  | 'headline'
  | 'map'
  | 'hero-photo'
  | 'photo-grid'
  | 'voices'
  | 'why-it-works'
  | 'how-we-track'
  | 'impact-numbers'
  | 'financials-at-a-glance'
  | 'headline-achievements'
  | 'investment-priorities'
  | 'alignment-principles'
  | 'safeguarding-risks'
  | 'commitment-progress'
  | 'upcoming-commitments'
  | 'whats-next'
  | 'country-acknowledgement';

export type ReportTone = 'short-and-visual' | 'evidence-and-named';

export interface PrincipleSpec {
  id: number;
  name: string;
  evidence: string; // markdown bullet list (multi-line ok)
}

export interface RiskSpec {
  risk: string;
  status: 'Low' | 'Medium' | 'Active' | 'High';
  mitigation: string;
}

export interface UpcomingCommitmentSpec {
  activity: string;
  timeline: string;
  status: string; // free-text, e.g. "🟡 In flight"
}

export interface InvestmentTierSpec {
  priority: number;
  name: string;
  budgetAud: number;
  description: string;
  outcomes: string;
}

export interface FunderCommitment {
  totalAud: number;
  totalUnits?: number;      // e.g. 109 beds for Centrecorp
  unitLabel?: string;       // e.g. "beds"
  paidToDateAud?: number;   // static fallback; live resolver may override
  toBePaidAud?: number;
  invoicesRaisedAud?: number;
  reportsSubmitted?: string; // e.g. "3 of 3 due so far"
  nextReportDue?: string;
  finalReportDue?: string;
  grantReference?: string;
  signedDocs?: string[];
}

export interface FunderContact {
  name: string;
  email?: string;
  phone?: string;
}

export interface ReportPeriod {
  slug: string;      // e.g. "2026-Q2"
  label: string;     // human readable, e.g. "Q2 2026"
  start: string;     // YYYY-MM-DD inclusive
  end: string;       // YYYY-MM-DD inclusive
}

export interface FunderConfig {
  slug: string;
  displayName: string;
  contactName: string;            // xero_invoices.contact_name match key
  xeroProjectCode: string;        // default 'ACT-GD'
  reportTitle: (period: ReportPeriod) => string;
  preparedBy: string;
  funderContact?: FunderContact;
  commitment: FunderCommitment;
  photoTags: string[];            // OR-tag list for EL photo fetch
  sections: SectionKey[];         // ordered include-list
  tone: ReportTone;
  // Optional community scope — if set, every Supabase query in the metric
  // resolvers filters `assets.community = X`. Empty = all-Goods.
  // Use the canonical community label as stored in `assets.community`,
  // e.g. "Utopia Homelands" / "Alice Springs" / "Tennant Creek".
  community?: string;
  principles?: PrincipleSpec[];   // Snow style
  risks?: RiskSpec[];
  upcomingCommitments?: UpcomingCommitmentSpec[];
  investmentTiers?: InvestmentTierSpec[];
  headlineAchievements?: string;  // markdown blob — funder-specific narrative
  additionalContext?: string;     // e.g. RHD section for Snow
}

/**
 * Runtime context handed to every metric resolver. Carries the period
 * window + clients for the three data sources.
 */
export interface ReportContext {
  funder: FunderConfig;
  period: ReportPeriod;
  // Goods Supabase (cwsyhpiuepvdjtxaozwf) — assets, bed_scans, bed_signals
  goods: SupabaseClient;
  // ACT infrastructure Supabase (tednluwflfhxyucgwigh) — xero_invoices
  actInfraUrl: string;
  actInfraKey: string;
  // Empathy Ledger Supabase — stories
  elUrl: string;
  elKey: string;
  elProjectId: string;
}

export type MetricResolver = (ctx: ReportContext) => Promise<string>;
