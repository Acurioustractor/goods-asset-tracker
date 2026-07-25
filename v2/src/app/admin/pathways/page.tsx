import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDashed,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  COMMUNITY_PATHWAYS,
  PATHWAY_AGENTS,
  PATHWAY_STAGES,
  type EvidenceState,
} from '@/lib/data/community-pathways';

export const metadata = {
  title: 'Community pathways — Goods admin',
  robots: { index: false, follow: false },
};

const evidenceStyle: Record<EvidenceState, string> = {
  verified: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'community-confirmation': 'border-amber-200 bg-amber-50 text-amber-900',
  'not-assessed': 'border-slate-200 bg-slate-50 text-slate-700',
};

const evidenceLabel: Record<EvidenceState, string> = {
  verified: 'Verified',
  'community-confirmation': 'Needs confirmation',
  'not-assessed': 'Not assessed',
};

const artifacts = [
  { name: 'Conversation brief', source: 'CRM + pathway', icon: MessageCircle },
  { name: 'Needs and capability audit', source: 'Community-confirmed record', icon: CheckCircle2 },
  { name: 'Module menu and pricing', source: 'Goods cost model', icon: FileText },
  { name: 'Media review gallery', source: 'Empathy Ledger + media register', icon: ImageIcon },
  { name: 'Community opportunity brief', source: 'Approved pathway', icon: FileText },
  { name: 'Funder evidence pack', source: 'Approved audience tier', icon: ShieldCheck },
];

export default function AdminPathwaysPage() {
  const verificationCounts = COMMUNITY_PATHWAYS.reduce(
    (counts, pathway) => {
      counts[pathway.evidenceState] += 1;
      return counts;
    },
    { verified: 0, 'community-confirmation': 0, 'not-assessed': 0 },
  );

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-5 border-b pb-7 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Internal operating workspace
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            Community pathways
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Prepare conversations, keep evidence boundaries visible and produce the
            right artifact only after community confirmation. This page is admin-only.
          </p>
        </div>
        <Link
          href="/pathways"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border bg-card px-4 py-2 text-sm font-semibold hover:border-primary/40"
        >
          View community-facing page <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <section className="grid gap-3 py-7 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-3xl font-semibold text-emerald-700">{verificationCounts.verified}</p>
          <p className="mt-1 text-sm font-medium">Evidence verified</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-3xl font-semibold text-amber-700">
            {verificationCounts['community-confirmation']}
          </p>
          <p className="mt-1 text-sm font-medium">Needs community confirmation</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-3xl font-semibold text-slate-600">
            {verificationCounts['not-assessed']}
          </p>
          <p className="mt-1 text-sm font-medium">Not yet assessed</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Active pathway desk</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Work from the next decision, not a generic engagement sequence.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{COMMUNITY_PATHWAYS.length} pathways</span>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {COMMUNITY_PATHWAYS.map((pathway) => (
            <article key={pathway.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{pathway.region}</p>
                  <h3 className="mt-1 font-display text-2xl">{pathway.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pathway.relationship}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${evidenceStyle[pathway.evidenceState]}`}>
                  {evidenceLabel[pathway.evidenceState]}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-muted/70 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  Next decision
                </p>
                <p className="mt-2 text-sm leading-6">{pathway.nextDecision}</p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold">Next actions</p>
                  <ul className="mt-2 space-y-2">
                    {pathway.nextActions.slice(0, 3).map((action) => (
                      <li key={action} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                        <CircleDashed className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold">Media boundary</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{pathway.mediaNote}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                <Link
                  href={`/admin/pathways/${pathway.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Prepare conversation <MessageCircle className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/pathways/${pathway.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold hover:border-primary/40"
                >
                  Review pathway <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/admin/media-library"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold hover:border-primary/40"
                >
                  Review media <ImageIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border bg-muted/50 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Bot className="h-4 w-4" /> Internal assistance
            </p>
            <h2 className="mt-3 font-display text-2xl">Bounded jobs with human gates</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              These roles organise evidence and prepare work. They never determine what a
              community needs, infer consent or publish material.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PATHWAY_AGENTS.map((agent) => (
              <article key={agent.id} className="rounded-xl border bg-card p-4">
                <p className="text-sm font-semibold">{agent.name}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{agent.responsibility}</p>
                <p className="mt-3 text-xs font-medium text-foreground">{agent.output}</p>
                <p className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                  {agent.humanGate}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Artifact production line</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One pathway record, translated for the audience and permission tier.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {artifacts.map((artifact) => (
            <article key={artifact.name} className="flex items-start gap-3 rounded-xl border bg-card p-4">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <artifact.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{artifact.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{artifact.source}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t pt-8">
        <h2 className="font-display text-2xl">Shared pathway stages</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PATHWAY_STAGES.map((stage, index) => (
            <li key={stage.id} className="rounded-xl border bg-card p-4">
              <span className="text-xs font-semibold text-primary">{index + 1}</span>
              <p className="mt-1 text-sm font-semibold">{stage.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{stage.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
