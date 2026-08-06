/**
 * The community's side of the numbers, one page, for a specific pathway.
 *
 * WHAT THIS IS FOR
 * ----------------
 * Every other money surface in this app answers Goods' question: does the bed
 * business wash its own face. This one answers the community's: what would this
 * mean for us. It is built to be walked through in person and printed, not sent.
 *
 * IT COMPUTES, IT DOES NOT QUOTE. Every figure comes from `modelPathway()` at
 * render time. Nothing is stored on the page. The stored `nextPhase.cost` on the
 * pathway record was wrong by $35,000/yr for months precisely because a figure
 * sat in a file with nothing recomputing it.
 *
 * THE STANDING RULE, WHICH THIS PAGE MUST NOT BREAK
 * -------------------------------------------------
 * No community sees a price for their own pathway before they have been walked
 * through it. So: noindex, out of every menu, and the banner stays at the top.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { COMMUNITY_PATHWAYS, communityPathway } from '@/lib/data/community-pathways';
import { VALUE_LADDER, modelPathway, networkFeePerSite } from '@/lib/cost-model/community-model';

/** Beds' worth of material a year at one shift. A planning rate, never a forecast. */
const PLANNING_VOLUME = 450;

export function generateStaticParams() {
  return COMMUNITY_PATHWAYS.map((pathway) => ({ id: pathway.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pathway = communityPathway(id);
  const robots = { index: false, follow: false } as const;
  return pathway
    ? { title: `${pathway.name}: what this would mean`, robots }
    : { robots };
}

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-AU');

export default async function PathwayNumbersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pathway = communityPathway(id);
  if (!pathway) notFound();

  const model = modelPathway(id, PLANNING_VOLUME);
  if (!model) notFound();

  const chosen = new Set(model.modules);
  const net = model.annual.netToCommunity;

  return (
    <div className="min-h-screen bg-goods-cream">
      <section className="border-b border-goods-grid bg-white print:hidden">
        <div className="container mx-auto max-w-5xl px-5 py-5">
          <Link
            href={`/pathways/${pathway.id}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#5f584e] hover:text-[#a64f35]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the {pathway.name} pathway
          </Link>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-5 py-12">
        {/* The gate. Not decorative - this page carries numbers no community has agreed to. */}
        <p className="rounded-2xl border-2 border-[#a64f35] bg-[#fdf3ef] px-5 py-4 text-sm leading-6 text-[#6b3625]">
          <strong>A working page, not an offer.</strong> These figures are ours to check, not
          {' '}{pathway.name}&rsquo;s to accept. Nothing here has been agreed with anyone, and none of it
          goes to community as a price until it has been talked through together, in person.
        </p>

        <header className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a64f35]">
            {pathway.region}
          </p>
          <h1 className="mt-3 font-display text-4xl text-goods-ink md:text-5xl">
            What this would mean for {pathway.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#625b50]">{pathway.invitation}</p>
        </header>

        {/* ── 1. The chain ─────────────────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="font-display text-2xl text-goods-ink">
            The line comes in five pieces. You choose which ones.
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#625b50]">
            Each piece takes the plastic one step further, and every step is worth more than the
            one before it. These are not our estimates: they are what Goods pays a factory in
            Sydney for the same work today.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#d5cabc] text-[#37332e]">
                  <th className="py-3 pr-4 font-semibold">Step</th>
                  <th className="py-3 pr-4 font-semibold">What you end up holding</th>
                  <th className="py-3 pr-4 text-right font-semibold">Worth per bed</th>
                </tr>
              </thead>
              <tbody>
                {VALUE_LADDER.map((rung) => {
                  const picked = chosen.has(rung.module);
                  return (
                    <tr
                      key={rung.module}
                      className={
                        picked
                          ? 'border-b border-goods-grid bg-[#f4f7f0]'
                          : 'border-b border-goods-grid text-[#8b8378]'
                      }
                    >
                      <td className="py-3 pr-4 font-semibold">
                        {rung.module.replace(/_/g, ' ')}
                        {picked && (
                          <span className="ml-2 rounded-full bg-[#405039] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                            Asked for
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 leading-6">{rung.output}</td>
                      <td className="py-3 pr-4 text-right font-semibold tabular-nums">
                        {rung.perBedEquivalent === null ? (
                          <span className="font-normal italic text-[#8b8378]">nobody buys this yet</span>
                        ) : (
                          money(rung.perBedEquivalent)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6b6358]">
            The big jump is pressing and cutting: it takes a bed&rsquo;s worth of plastic from{' '}
            <strong>$40</strong> to <strong>$344</strong>. Everything before that step is getting
            ready. That step is where the money starts.
          </p>
        </section>

        {/* ── 2. What it costs and what it brings ──────────────────────── */}
        <section className="mt-16">
          <h2 className="font-display text-2xl text-goods-ink">
            What {pathway.name} asked for, with the numbers on it
          </h2>

          {model.modules.length === 0 ? (
            <p className="mt-5 max-w-3xl leading-7 text-[#625b50]">
              {pathway.name} has not asked for production, and this page does not invent a
              container to price. What was asked for is governance and the conversation, and that
              costs nothing to set up and earns nothing, which is the honest answer rather than a
              missing one.
            </p>
          ) : (
            <>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-goods-grid bg-white p-6">
                  <dt className="text-sm font-semibold text-[#6b6358]">To set it up, once</dt>
                  <dd className="mt-2 font-display text-3xl text-goods-ink">
                    {money(model.setup.capexLow)} &ndash; {money(model.setup.capexHigh)}
                  </dd>
                  <p className="mt-3 text-sm leading-6 text-[#6b6358]">
                    Not money a community finds. This is what a funder or an investor is asked
                    for, and it buys the gear, the container, the power and the pad.
                  </p>
                </div>

                <div className="rounded-2xl border border-goods-grid bg-white p-6">
                  <dt className="text-sm font-semibold text-[#6b6358]">To keep it running, each year</dt>
                  <dd className="mt-2 font-display text-3xl text-goods-ink">
                    {money(model.annual.operatingCost)}
                  </dd>
                  <p className="mt-3 text-sm leading-6 text-[#6b6358]">
                    Most of this is the cost of having a working site at all &mdash; books,
                    insurance, the yard &mdash; and it lands the moment anyone works there,
                    whatever they make.
                  </p>
                </div>
              </dl>

              <div
                className={
                  net !== null && net < 0
                    ? 'mt-6 rounded-2xl border-2 border-[#c2703f] bg-[#fdf6ef] p-6'
                    : 'mt-6 rounded-2xl border border-[#b9c5ac] bg-[#f4f7f0] p-6'
                }
              >
                <p className="text-sm font-semibold text-[#6b6358]">
                  What comes in each year, making {PLANNING_VOLUME.toLocaleString()} beds&rsquo; worth
                </p>
                {model.annual.grossEarnings === null ? (
                  <p className="mt-3 leading-7 text-[#5f584e]">
                    Nothing yet, and that is the point worth being straight about. Nobody buys
                    sorted plastic today, so this selection has no one to sell to until it goes one
                    step further, or until Goods agrees to buy the feedstock itself.
                  </p>
                ) : (
                  <>
                    <p className="mt-3 font-display text-3xl text-goods-ink">
                      {money(model.annual.grossEarnings)} in, {money(model.annual.operatingCost)} out
                    </p>
                    {model.sells && model.makingPerBed !== null && (
                      /* Two different kinds of work, and a community should see which is
                         which. Making is what comes off the line; selling is the spread
                         on getting a bed into a home, whoever built it. */
                      <p className="mt-2 text-sm leading-6 text-[#6b6358]">
                        Of that, {money(model.makingPerBed * PLANNING_VOLUME)} is for what you make
                        and {money(model.sellingPerBed! * PLANNING_VOLUME)} is for getting beds into
                        homes.
                      </p>
                    )}
                    <p className="mt-3 text-lg font-semibold text-goods-ink">
                      {net !== null && net < 0
                        ? `This step needs about ${money(Math.abs(net))} a year of grant behind it.`
                        : `That leaves ${money(net ?? 0)} a year in community.`}
                    </p>
                    {model.buysInputIn && (
                      /* Without this, a site that skips collection looks BETTER than one that
                         does the whole chain, purely because the plastic it has to buy is not
                         costed. The caveat has to sit with the number, not in a list below it. */
                      <p className="mt-3 rounded-xl bg-[#fdf6ef] px-4 py-3 text-sm leading-6 text-[#6b3625]">
                        <strong>Read this one carefully.</strong> This pathway starts partway down
                        the chain, so the plastic has to be bought in rather than collected here.
                        That cost is real and it is not in the figure above, so the true number is
                        lower. We do not know yet by how much.
                      </p>
                    )}
                    <p className="mt-3 leading-7 text-[#5f584e]">
                      {net !== null && net < 0 ? (
                        <>
                          <strong>This is not money the community is out of pocket.</strong> Nobody
                          here puts in capital or covers running costs &mdash; that is carried by
                          grant funding, the way the wraparound always is. What the figure means is
                          that this step does not yet pay for itself out of what it sells, so it
                          needs grant behind it until the chain goes further. Two things change
                          that: pressing, which takes a bed&rsquo;s worth from $40 to $344, or
                          selling and delivering beds, which does not need a press at all.
                        </>
                      ) : (
                        <>
                          That is what arrives in community. How it splits between wages and what
                          the community keeps is not ours to decide, and this page will not guess
                          at it.
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </section>

        {/* ── 3. Why more sites is good for this one ───────────────────── */}
        <section className="mt-16">
          <h2 className="font-display text-2xl text-goods-ink">Why we do not stop at one</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#625b50]">
            Behind every site is one shared team: quality, suppliers, freight, the person on the
            road. That costs {money(networkFeePerSite(1))} a year whether there is one site or
            five, so every community that joins makes every other community&rsquo;s share smaller.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {[1, 2, 3].map((sites) => (
              <div
                key={sites}
                className="min-w-[10rem] flex-1 rounded-2xl border border-goods-grid bg-white p-5"
              >
                <p className="text-sm font-semibold text-[#6b6358]">
                  {sites} {sites === 1 ? 'site' : 'sites'}
                </p>
                <p className="mt-1 font-display text-2xl text-goods-ink">
                  {money(networkFeePerSite(sites))}
                </p>
                <p className="mt-1 text-xs text-[#8b8378]">shared cost, each site</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6b6358]">
            No community has been asked to pay this, and the share is not agreed with anyone. It
            is here because it is the honest reason the third site matters to the first one.
          </p>
        </section>

        {/* ── 4. Open decisions ────────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="font-display text-2xl text-goods-ink">Still to work out together</h2>
          <ul className="mt-5 space-y-4">
            {model.openDecisions.map((decision) => (
              <li
                key={decision}
                className="rounded-2xl border border-goods-grid bg-white px-5 py-4 leading-7 text-[#5f584e]"
              >
                {decision}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-[#6b6358]">
            Next decision on this pathway: {pathway.nextDecision}
          </p>
        </section>

        <footer className="mt-16 border-t border-goods-grid pt-6 text-xs leading-6 text-[#8b8378]">
          Every figure on this page is worked out fresh from the cost model when the page loads,
          not typed in. Step values come from Goods&rsquo; own invoices with Defy. Volume is{' '}
          {PLANNING_VOLUME.toLocaleString()} beds&rsquo; worth of material a year, a planning rate
          rather than a sales forecast.
        </footer>
      </div>
    </div>
  );
}
