import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  COMMUNITY_PATHWAYS,
  communityPathway,
  type EvidenceState,
  type ModuleState,
} from '@/lib/data/community-pathways';

export const metadata = {
  title: 'Prepare community conversation — Goods admin',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return COMMUNITY_PATHWAYS.map(({ id }) => ({ id }));
}

const stateLabel: Record<ModuleState, string> = {
  requested: 'Requested',
  exploring: 'Explore together',
  later: 'Later option',
  'not-assessed': 'Not discussed',
};

const evidenceLabel: Record<EvidenceState, string> = {
  verified: 'Verified',
  'community-confirmation': 'Return for confirmation',
  'not-assessed': 'Not yet assessed',
};

const conversationSections = [
  {
    title: 'Begin with authority',
    prompts: [
      'Who should be part of this conversation and who has authority to make the decision?',
      'Is this still something you want to explore? What has changed since we last spoke?',
      'How would you like decisions, notes and follow-ups to come back to you?',
    ],
  },
  {
    title: 'Understand what is already strong',
    prompts: [
      'What people, skills, programs, equipment and spaces are already working here?',
      'What should we build from, rather than duplicate or replace?',
      'Where do things currently get stuck: equipment, staffing, training, power, transport or funding?',
    ],
  },
  {
    title: 'Choose the useful support',
    prompts: [
      'What would be useful first, and what should wait?',
      'Who would operate or care for it locally?',
      'What support would make it practical: delivery, training, maintenance, coordination or introductions?',
    ],
  },
  {
    title: 'Agree ownership and evidence',
    prompts: [
      'Who should own the equipment, designs, information and story?',
      'What can be shared publicly, with funders only, or kept within the partnership?',
      'How will we know this is useful, and when should we review or change it?',
    ],
  },
];

export default async function CommunityConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pathway = communityPathway(id);

  if (!pathway) notFound();

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <Link
        href="/admin/pathways"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Pathway desk
      </Link>

      <header className="mt-4 grid gap-6 border-b pb-8 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Conversation workspace · {pathway.region}
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{pathway.name}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Use this as a listening guide, not a form to complete. Capture only what people
            choose to share, then return a plain-language summary for correction.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            Purpose of the next conversation
          </p>
          <p className="mt-3 text-sm leading-6">{pathway.nextDecision}</p>
          <p className="mt-4 border-t pt-4 text-xs leading-5 text-muted-foreground">
            <span className="font-semibold text-foreground">People:</span>{' '}
            {pathway.communityLead}
          </p>
        </div>
      </header>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h2 className="font-display text-2xl">What we think we heard</h2>
          </div>
          <p className="mt-3 text-sm leading-6">{pathway.invitation}</p>
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            <strong>Evidence boundary:</strong> {pathway.evidenceNote}
          </p>
        </article>
        <article className="rounded-2xl border bg-muted/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Before the call
          </p>
          <ul className="mt-4 space-y-3">
            {[
              'Confirm the right people and a suitable format',
              'Review the last promise or outstanding action',
              'Bring only relevant options and known costs',
              'Confirm who will take notes and return them',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-5">
                <Circle className="mt-1 h-3 w-3 shrink-0 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      {pathway.pilot ? (
        <section className="mt-10 rounded-3xl border bg-muted/40 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Live pilot
              </p>
              <h2 className="mt-2 font-display text-3xl">Test the system with this relationship</h2>
            </div>
            <span className="self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
              {pathway.pilot.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-emerald-800">Verified starting points</h3>
              <ul className="mt-4 space-y-3">
                {pathway.pilot.verified.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <h3 className="text-sm font-semibold text-amber-950">Assumptions to test with Michelle</h3>
              <ul className="mt-4 space-y-3">
                {pathway.pilot.assumptions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-amber-950/75">
                    <Circle className="mt-1 h-3 w-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-semibold">Artifact test sequence</h3>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {pathway.pilot.artifactSequence.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl bg-muted/60 p-3 text-xs leading-5">
                    <span className="font-semibold text-primary">{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-semibold">System boundary</h3>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                {pathway.pilot.crmBoundary}
              </p>
            </article>
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Listening guide
        </p>
        <h2 className="mt-2 font-display text-3xl">A yarn, not an audit done to people</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {conversationSections.map((section, index) => (
            <article key={section.title} className="rounded-2xl border bg-card p-5">
              <p className="text-xs font-semibold text-primary">{index + 1}</p>
              <h3 className="mt-1 text-base font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.prompts.map((prompt) => (
                  <li key={prompt} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <Circle className="mt-1.5 h-3 w-3 shrink-0" />
                    {prompt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Modules to discuss—not prescribe</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These reflect the current record. Change, remove or add options after the conversation.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {pathway.modules.map((module) => (
            <article key={module.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold">{module.name}</h3>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold">
                  {stateLabel[module.state]}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{module.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="font-display text-2xl">Story and media boundary</h2>
          </div>
          <p className="mt-3 text-xs font-semibold">{evidenceLabel[pathway.mediaState]}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{pathway.mediaNote}</p>
          <Link
            href="/admin/media-library"
            className="mt-5 inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-xs font-semibold hover:border-primary/40"
          >
            Review linked media
          </Link>
        </article>

        <article className="rounded-2xl border bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <h2 className="font-display text-2xl">What comes back</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              'A one-page summary in plain language',
              'What was confirmed, corrected and left open',
              'Chosen modules with transparent cost ranges',
              'Named owners, next actions and review date',
              'A clear record of what may be shared and with whom',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-primary-foreground/85">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-10 rounded-2xl border-2 border-dashed p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          After the conversation
        </p>
        <h2 className="mt-2 font-display text-2xl">Do not move to pricing or funding yet if…</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          The decision-maker was not present, the community request is still unclear, local
          ownership or operation is unresolved, or the notes have not been returned for
          correction. The next stage is earned by confirmation, not by completing a form.
        </p>
      </section>
    </div>
  );
}
