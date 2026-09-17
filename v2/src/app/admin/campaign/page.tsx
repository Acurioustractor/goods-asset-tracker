import { ArrowRight, Clock, DoorOpen, KanbanSquare, User } from 'lucide-react';

import {
  AUDIENCE_PATHWAYS,
  OWNERS,
  pathwayGaps,
  type MessageClass,
  type PathwayReadiness,
  type StepState,
} from '@/lib/ghl/audience-pathways';
import { findAudienceSegment, findSmartList } from '@/lib/ghl/smart-lists';
import { PUBLIC_FORMS, type GoodsHears, type TheyGet } from '@/lib/forms/public-forms';
import {
  campaignsFor,
  readyToSwitchOn,
  blockedOnConsent,
  type CampaignKind,
  type CampaignStatus,
} from '@/lib/ghl/campaigns';

export const metadata = {
  title: 'Campaign lanes — Goods admin',
  robots: { index: false, follow: false },
};

const stateStyle: Record<StepState, string> = {
  live: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'built-off': 'border-amber-200 bg-amber-50 text-amber-900',
  manual: 'border-slate-200 bg-slate-50 text-slate-700',
  missing: 'border-rose-200 bg-rose-50 text-rose-800',
};

const stateLabel: Record<StepState, string> = {
  live: 'Live',
  'built-off': 'Built, switched off',
  manual: 'By hand',
  missing: 'Does not exist',
};

const classLabel: Record<MessageClass, string> = {
  answer: 'Answer owed',
  service: 'Service',
  broadcast: 'Broadcast',
  none: 'They get nothing',
};

const campaignStatusStyle: Record<CampaignStatus, string> = {
  live: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'built-off': 'border-amber-200 bg-amber-50 text-amber-900',
  drafted: 'border-sky-200 bg-sky-50 text-sky-800',
  'not-built': 'border-rose-200 bg-rose-50 text-rose-800',
};

const campaignStatusLabel: Record<CampaignStatus, string> = {
  live: 'Sending',
  'built-off': 'Built, switched off',
  drafted: 'Written, not built',
  'not-built': 'Not built',
};

const kindLabel: Record<CampaignKind, string> = {
  reply: 'Reply owed',
  service: 'Service',
  broadcast: 'Broadcast',
  outreach: 'Person to person',
  inward: 'Nags Goods, not them',
};

const theyGetStyle: Record<TheyGet, string> = {
  acknowledgement: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'a human reply': 'border-sky-200 bg-sky-50 text-sky-800',
  nothing: 'border-rose-200 bg-rose-50 text-rose-800',
};

const goodsHearsStyle: Record<GoodsHears, string> = {
  'inbox email': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'ghl task': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'ghl conversation': 'border-slate-200 bg-slate-50 text-slate-700',
  nothing: 'border-rose-200 bg-rose-50 text-rose-800',
};

const readinessStyle: Record<PathwayReadiness, string> = {
  live: 'bg-emerald-600',
  partial: 'bg-amber-500',
  'not-started': 'bg-rose-500',
};

export default function AdminCampaignPage() {
  const gaps = pathwayGaps();
  const live = AUDIENCE_PATHWAYS.filter((p) => p.readiness === 'live').length;
  const ready = readyToSwitchOn();
  const consentBlocked = blockedOnConsent();

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <header className="border-b pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          The campaign machine
        </p>
        <h1 className="mt-2 font-serif text-4xl">Eight lanes, end to end</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          For each audience: where they come in, what they get, what moves them to the next stage and
          who is on the hook. Read from{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">lib/ghl/audience-pathways.ts</code>,
          which is guarded, so a door that disappears or a board id that goes stale fails a test rather
          than quietly misleading this page.
        </p>
        <dl className="mt-6 flex flex-wrap gap-8">
          {[
            { label: 'Lanes', value: String(AUDIENCE_PATHWAYS.length) },
            { label: 'Running end to end', value: `${live} of ${AUDIENCE_PATHWAYS.length}` },
            { label: 'Steps with a gap', value: String(gaps.length) },
            { label: 'Ready to switch on', value: String(ready.length) },
            { label: 'Waiting on consent', value: String(consentBlocked.length) },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs uppercase tracking-wider text-slate-500">{stat.label}</dt>
              <dd className="mt-1 font-serif text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-10 rounded-xl border bg-white p-5">
        <h2 className="font-serif text-xl">Every door the public can knock on</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {PUBLIC_FORMS.length} forms, found by walking the app rather than by keeping a list. For
          each one: what the person gets back, and how a human here finds out. A form that answers
          nothing to both cannot ship.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wider text-slate-500">
                <th className="pb-2 pr-4 font-medium">Form</th>
                <th className="pb-2 pr-4 font-medium">Lane</th>
                <th className="pb-2 pr-4 font-medium">They get</th>
                <th className="pb-2 font-medium">Goods hears</th>
              </tr>
            </thead>
            <tbody>
              {PUBLIC_FORMS.map((form) => (
                <tr key={form.file} className="border-b last:border-0 align-top">
                  <td className="py-2.5 pr-4">
                    <span className="text-slate-900">{form.name}</span>
                    <span className="block font-mono text-[10px] text-slate-400">{form.handler}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600">
                    <a className="underline-offset-2 hover:underline" href={`#${form.audience}`}>
                      {form.audience}
                    </a>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${theyGetStyle[form.theyGet]}`}
                    >
                      {form.theyGet}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${goodsHearsStyle[form.goodsHears]}`}
                    >
                      {form.goodsHears}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 space-y-12">
        {AUDIENCE_PATHWAYS.map((pathway) => {
          const owner = OWNERS[pathway.owner];
          const segments = pathway.segmentIds
            .map((id) => findAudienceSegment(id))
            .filter((s): s is NonNullable<typeof s> => Boolean(s));
          const lists = pathway.smartListIds
            .map((id) => findSmartList(id))
            .filter((l): l is NonNullable<typeof l> => Boolean(l));

          return (
            <section key={pathway.audience} id={pathway.audience} className="scroll-mt-8">
              <div className="flex flex-wrap items-baseline gap-3 border-b pb-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${readinessStyle[pathway.readiness]}`}
                  aria-hidden
                />
                <h2 className="font-serif text-2xl">{pathway.name}</h2>
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  {pathway.readiness === 'live'
                    ? 'running'
                    : pathway.readiness === 'partial'
                      ? 'part built'
                      : 'not started'}
                </span>
                {pathway.communityLine && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                    Community line · broadcast off (R9)
                  </span>
                )}
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">
                {pathway.whoTheyAre}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {owner.name}
                </span>
                {pathway.clock && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {pathway.clock}
                  </span>
                )}
                {pathway.board && (
                  <span className="inline-flex items-center gap-1.5">
                    <KanbanSquare className="h-3.5 w-3.5 text-slate-400" />
                    {pathway.board.boardName}
                  </span>
                )}
              </div>

              {(segments.length > 0 || lists.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {segments.map((segment) => (
                    <span
                      key={segment.id}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600"
                      title={segment.description}
                    >
                      {segment.name}
                      {segment.readiness !== 'live' && ' · empty by design'}
                    </span>
                  ))}
                  {lists.map((list) => (
                    <span
                      key={list.id}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600"
                      title={list.description}
                    >
                      {list.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <DoorOpen className="h-3.5 w-3.5" /> Where they enter
                  </h3>
                  {pathway.entries.length === 0 ? (
                    <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                      There is no door.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {pathway.entries.map((entry) => (
                        <li key={entry.door} className="rounded-lg border bg-white p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm text-slate-800">{entry.door}</p>
                            <span
                              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${stateStyle[entry.state]}`}
                            >
                              {stateLabel[entry.state]}
                            </span>
                          </div>
                          {entry.tags.length > 0 && (
                            <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-500">
                              {entry.tags.join('  ')}
                            </p>
                          )}
                          {entry.note && (
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">{entry.note}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    What they get, and what moves them on
                  </h3>
                  <ol className="mt-3 space-y-3">
                    {pathway.steps.map((step, index) => (
                      <li key={step.id} className="rounded-lg border bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            <span className="mr-2 text-slate-400">{index + 1}</span>
                            {step.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">
                              {classLabel[step.messageClass]}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${stateStyle[step.state]}`}
                            >
                              {stateLabel[step.state]}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{step.where}</p>
                        <p className="mt-2 text-sm text-slate-700">{step.theyGet}</p>
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{step.advance}</span>
                        </p>
                        {step.gap && (
                          <p className="mt-3 border-l-2 border-amber-300 pl-3 text-xs leading-relaxed text-slate-600">
                            {step.gap}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  The campaigns on this lane
                </h3>
                <ul className="mt-3 grid gap-3 md:grid-cols-2">
                  {campaignsFor(pathway.audience).map((campaign) => (
                    <li key={campaign.id} className="rounded-lg border bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${campaignStatusStyle[campaign.status]}`}
                        >
                          {campaignStatusLabel[campaign.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                        {kindLabel[campaign.kind]} · {campaign.channel} · {OWNERS[campaign.owner].name} ·{' '}
                        {campaign.cadence}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        <span className="font-medium text-slate-600">Fires on:</span> {campaign.trigger}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{campaign.brief}</p>
                      {campaign.blockedOn && (
                        <p className="mt-3 border-l-2 border-amber-300 pl-3 text-xs leading-relaxed text-slate-600">
                          {campaign.blockedOn}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 rounded-lg border border-slate-900/10 bg-slate-900 p-4 text-sm leading-relaxed text-white">
                <span className="mr-2 text-xs uppercase tracking-wider text-white/60">Next move</span>
                {pathway.nextMove}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
